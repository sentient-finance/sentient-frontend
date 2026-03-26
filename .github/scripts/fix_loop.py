#!/usr/bin/env python3
"""MiniMax Fix Loop - handles iterative fixing of technical errors (Refactored & Hardened)."""

import json
import os
import sys
import re
import time
import uuid
from utils import run_command, call_minimax_api, extract_json, sanitize_path

LOG_FILE = '/tmp/fix_output.log'

# Patterns that indicate errors which CANNOT be fixed by code changes
UNFIXABLE_PATTERNS = [
    ('Cannot find type definitions', 'Missing @types package or tsconfig'),
    ('Cannot find module', 'Missing dependency in package.json or install not run'),
    ('ENOENT', 'File or directory does not exist on the system'),
    ('secret.*not set', 'Missing GitHub secret - need to add secret in repo settings'),
    ('Error: Input required', 'Missing required input/argument for workflow'),
    ('not found globally', 'Package not installed or missing path'),
    ('permission denied', 'No permission to access file/directory'),
    ('Resource not found', 'Resource does not exist on the system'),
]

def log(msg):
    """Log to both stdout and log file."""
    print(msg, file=sys.stdout)
    try:
        with open(LOG_FILE, 'a') as f:
            f.write(msg + '\n')
    except: pass

def set_output(name: str, value: str):
    """Safely write output for GitHub Actions (multiline support)."""
    delimiter = f'ghadelimiter_{uuid.uuid4().hex}'
    output_path = os.environ.get('GITHUB_OUTPUT', '/tmp/gha_output')
    with open(output_path, 'a') as f:
        f.write(f'{name}<<{delimiter}\n')
        f.write(f'{value}\n')
        f.write(f'{delimiter}\n')
    log(f"Output set: {name}={value}")

def is_fixable_error(error_output: str) -> tuple[bool, str]:
    """Check if the error can be fixed by code changes or requires manual intervention."""
    error_lower = error_output.lower()
    for pattern, reason in UNFIXABLE_PATTERNS:
        if pattern.lower() in error_lower:
            return False, reason
    return True, ''

def run_fixes_loop():
    # Clear log file
    open(LOG_FILE, 'w').close()
    
    api_url = os.environ.get('MINIMAX_API_URL', 'https://api.minimax.io/anthropic')
    api_key = os.environ.get('ANTHROPIC_API_KEY', '')
    model = os.environ.get('MODEL', 'MiniMax-M2.7')
    rounds = int(os.environ.get('ROUNDS', '10'))
    until_success = os.environ.get('FIX_UNTIL_SUCCESS', 'false').lower() == 'true'
    repo = os.environ.get('GITHUB_REPOSITORY', '')
    pr_number = os.environ.get('PR_NUMBER', '0')
    github_token = os.environ.get('GITHUB_TOKEN', '')

    log(f"Starting fix loop for PR #{pr_number}, rounds={rounds}, until_success={until_success}")

    # B4: Env validation - fail fast if required env vars are missing
    required_env = ['ANTHROPIC_API_KEY', 'GITHUB_TOKEN', 'PR_NUMBER']
    missing = [k for k in required_env if not os.environ.get(k)]
    if missing:
        log(f"ERROR: Missing required env vars: {missing}")
        set_output('all_fixed', 'false')
        set_output('fix_rounds', '0')
        sys.exit(1)

    if until_success:
        rounds = 15
        log("Mode: Fixing until success (max 15 rounds)")
    else:
        log(f"Mode: Fixing up to {rounds} rounds")

    system_prompt = (
        "You are an expert developer and bug fixer. Your task is to fix the provided code errors. "
        "Respond ONLY with valid JSON (no markdown, no backticks). "
        "The JSON must contain a 'fixes' array of {file: string, content: string}.\n"
        "Provide the ENTIRE content of the file with the fix applied."
    )

    fix_rounds_done = 0
    all_passed = False

    for round_num in range(1, rounds + 1):
        fix_rounds_done = round_num
        log(f"\n{'='*50}\nFix Round {round_num} of {rounds}\n{'='*50}")
        
        round_start_time = time.time()
        all_errors = []
        
        # Optimized check sequence: format -> lint -> type-check -> build
        # Run sequentially with early exit for faster feedback
        checks = [
            ("Formatting", "bun run format:check"),
            ("Linting", "bun run lint"),
            ("Type Checking", "bun run type-check"),
            ("Building", "bun run build")
        ]
        
        passed_all = True
        for name, cmd in checks:
            log(f"Running {name}...")
            start = time.time()
            out, err, rc = run_command(cmd)
            duration = time.time() - start
            log(f"  Result: {'PASS' if rc == 0 else 'FAIL'} ({duration:.1f}s)")
            
            if rc != 0:
                all_errors.append(f"{name} errors:\n{out}\n{err}")
                passed_all = False
                # Early exit: Stop running more expensive checks if an earlier one failed
                log(f"  Stopping remaining checks for this round due to {name} failure.")
                break

        if passed_all:
            log("✅ All checks passed! No further fixes needed.")
            all_passed = True
            break
        
        errors_text = "\n\n".join(all_errors)[:8000]

        # B7: Check if error is fixable by code changes
        fixable, reason = is_fixable_error(errors_text)
        if not fixable:
            log(f"⚠️ Auto-fix stopping early — error requires manual intervention: {reason}")
            log(f"::warning::Error cannot be fixed by code changes: {reason}")
            # Still post a comment about the unfixable error
            from utils import post_github_comment
            comment = f"⚠️ **Auto-fix stopped early** — Error requires manual intervention: `{reason}`\n\nError details:\n```\n{errors_text[:1000]}\n```"
            post_github_comment(repo, pr_number, comment, github_token)
            break

        log("Asking AI for fixes...")
        ai_start = time.time()
        files_to_fix = set()
        matches = re.findall(r'([a-zA-Z0-9\/\._\-]+\.(?:ts|tsx|js|jsx|css|json))', errors_text)
        for m in matches:
            try:
                if os.path.isfile(sanitize_path(m)):
                    files_to_fix.add(m)
            except ValueError: pass
        
        code_context = ""
        for fpath in list(files_to_fix)[:10]:
            try:
                with open(sanitize_path(fpath), 'r') as f:
                    code_context += f"\nFile: {fpath}\nContent:\n{f.read()}\n"
            except: pass

        user_content = (
            f"Please fix these technical errors:\n\n{errors_text}\n\n"
            f"Current Code Context:\n{code_context}\n\n"
            "Return the FULL content for each file you fix in the JSON format specified."
        )

        payload = {
            "model": model, 
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.1, 
            "max_tokens": 4000
        }

        try:
            response_body, _ = call_minimax_api(payload, api_key, api_url)
            log(f"  AI response received ({time.time() - ai_start:.1f}s)")
            fix_data = extract_json(response_body)
            
            applied = False
            for fix in fix_data.get('fixes', []):
                fpath = fix.get('file')
                fcontent = fix.get('content')
                if fpath and fcontent:
                    try:
                        safe_path = sanitize_path(fpath)
                        log(f"  Applying fix to {fpath}...")
                        with open(safe_path, 'w') as f:
                            f.write(fcontent)
                        applied = True
                    except ValueError as ve:
                        log(f"  Blocked fix for {fpath}: {ve}")

            if applied:
                log("  Committing fixes...")
                run_command("git config user.name 'github-actions[bot]'")
                run_command("git config user.email 'github-actions[bot]@users.noreply.github.com'")
                run_command("git add -A")
                run_command(f"git commit -m 'ci: auto-fix technical errors (round {round_num}) [skip ci]'")
            else:
                log("  No fixes applied in this round.")

        except Exception as e:
            log(f"  Error in fix loop round {round_num}: {e}")
            
        log(f"Round {round_num} completed in {time.time() - round_start_time:.1f}s")

    log(f"\nFix loop complete. fix_rounds={fix_rounds_done}, all_passed={all_passed}")
    
    if not all_passed:
        log("Not all checks passed, but pushing fixes for review...")
    
    push_out, push_err, push_rc = run_command("git push")
    if push_rc != 0:
        log(f"Push failed: {push_err}")
    else:
        log("Push successful")

    # Always emit output - B4 fix: output was missing if script crashed early
    set_output('all_fixed', str(all_passed).lower())
    set_output('fix_rounds', str(fix_rounds_done))

if __name__ == '__main__':
    run_fixes_loop()
