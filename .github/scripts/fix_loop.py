#!/usr/bin/env python3
"""MiniMax Fix Loop - handles iterative fixing of technical errors (Refactored & Hardened)."""

import json
import os
import sys
import re
import time
from utils import run_command, call_minimax_api, extract_json, sanitize_path

def run_fixes_loop():
    api_url = os.environ.get('MINIMAX_API_URL', 'https://api.minimax.io/anthropic')
    api_key = os.environ.get('ANTHROPIC_API_KEY', '')
    model = os.environ.get('MODEL', 'MiniMax-M2.7')
    rounds = int(os.environ.get('ROUNDS', '10'))
    until_success = os.environ.get('FIX_UNTIL_SUCCESS', 'false').lower() == 'true'
    repo = os.environ.get('GITHUB_REPOSITORY', '')
    pr_number = os.environ.get('PR_NUMBER', '0')
    github_token = os.environ.get('GITHUB_TOKEN', '')

    if until_success:
        rounds = 15
        print("Mode: Fixing until success (max 15 rounds)")
    else:
        print(f"Mode: Fixing up to {rounds} rounds")

    system_prompt = (
        "You are an expert developer and bug fixer. Your task is to fix the provided code errors. "
        "Respond ONLY with valid JSON (no markdown, no backticks). "
        "The JSON must contain a 'fixes' array of {file: string, content: string}.\n"
        "Provide the ENTIRE content of the file with the fix applied."
    )

    for round_num in range(1, rounds + 1):
        print(f"\n{'='*50}\nFix Round {round_num} of {rounds}\n{'='*50}")
        
        round_start_time = time.time()
        all_errors = []
        
        # Optimized check sequence: format -> lint -> type-check -> build
        checks = [
            ("Formatting", "bun run format:check"),
            ("Linting", "bun run lint"),
            ("Type Checking", "bun run type-check"),
            ("Building", "bun run build")
        ]
        
        passed_all = True
        for name, cmd in checks:
            print(f"Running {name}...")
            start = time.time()
            out, err, rc = run_command(cmd)
            duration = time.time() - start
            print(f"  Result: {'✅' if rc == 0 else '❌'} ({duration:.1f}s)")
            
            if rc != 0:
                all_errors.append(f"{name} errors:\n{out}\n{err}")
                passed_all = False
                # Early exit: Stop running more expensive checks if an earlier one failed
                # This provides the AI with immediate, focused errors.
                print(f"  Stopping remaining checks for this round due to {name} failure.")
                break

        if passed_all:
            print("✅ All checks passed! No further fixes needed.")
            break
        
        errors_text = "\n\n".join(all_errors)[:8000]

        print("Asking AI for fixes...")
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
            print(f"  AI response received ({time.time() - ai_start:.1f}s)")
            fix_data = extract_json(response_body)
            
            applied = False
            for fix in fix_data.get('fixes', []):
                fpath = fix.get('file')
                fcontent = fix.get('content')
                if fpath and fcontent:
                    try:
                        safe_path = sanitize_path(fpath)
                        print(f"  Applying fix to {fpath}...")
                        with open(safe_path, 'w') as f:
                            f.write(fcontent)
                        applied = True
                    except ValueError as ve:
                        print(f"  Blocked fix for {fpath}: {ve}")

            if applied:
                print("  Committing fixes...")
                run_command("git config user.name 'github-actions[bot]'")
                run_command("git config user.email 'github-actions[bot]@users.noreply.github.com'")
                run_command("git add -A")
                run_command(f"git commit -m 'ci: auto-fix technical errors (round {round_num}) [skip ci]'")
            else:
                print("  No fixes applied in this round.")

        except Exception as e:
            print(f"  Error in fix loop round {round_num}: {e}")
            
        print(f"Round {round_num} completed in {time.time() - round_start_time:.1f}s")

    # Final check status for result reporting
    final_passed = passed_all
    print(f"\nFix loop finished. Success: {final_passed}")
    
    print("Pushing changes...")
    run_command("git push")

    out_file = os.environ.get('GITHUB_OUTPUT', '/tmp/gha_output')
    with open(out_file, 'a') as f:
        f.write(f"all_fixed={str(final_passed).lower()}\nfix_rounds={round_num}\n")

if __name__ == '__main__':
    run_fixes_loop()
