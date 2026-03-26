#!/usr/bin/env python3
"""MiniMax Fix Loop - handles iterative fixing of technical errors (Refactored & Hardened)."""

import json
import os
import sys
import re
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

        print("Running checks...")
        lint_out, lint_err, lint_rc = run_command("bun run lint")
        format_out, format_err, format_rc = run_command("bun run format:check")
        type_out, type_err, type_rc = run_command("bun run type-check")
        build_out, build_err, build_rc = run_command("bun run build")

        if all(rc == 0 for rc in [lint_rc, format_rc, type_rc, build_rc]):
            print("✅ All checks passed! No further fixes needed.")
            break
        
        all_errors = []
        if lint_rc != 0: all_errors.append(f"Lint errors:\n{lint_out}\n{lint_err}")
        if format_rc != 0: all_errors.append(f"Format errors:\n{format_out}\n{format_err}")
        if type_rc != 0: all_errors.append(f"Type check errors:\n{type_out}\n{type_err}")
        if build_rc != 0: all_errors.append(f"Build errors:\n{build_out}\n{build_err}")
        
        errors_text = "\n\n".join(all_errors)[:8000]

        print("Asking AI for fixes...")
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
            fix_data = extract_json(response_body)
            
            applied = False
            for fix in fix_data.get('fixes', []):
                fpath = fix.get('file')
                fcontent = fix.get('content')
                if fpath and fcontent:
                    try:
                        safe_path = sanitize_path(fpath)
                        print(f"Applying fix to {fpath}...")
                        with open(safe_path, 'w') as f:
                            f.write(fcontent)
                        applied = True
                    except ValueError as ve:
                        print(f"Blocked fix for {fpath}: {ve}")

            if applied:
                run_command("git config user.name 'github-actions[bot]'")
                run_command("git config user.email 'github-actions[bot]@users.noreply.github.com'")
                run_command("git add -A")
                run_command(f"git commit -m 'ci: auto-fix technical errors (round {round_num}) [skip ci]'")
            else:
                print("No fixes applied in this round.")

        except Exception as e:
            print(f"Error in fix loop round {round_num}: {e}")

    run_command("git push")

if __name__ == '__main__':
    run_fixes_loop()
