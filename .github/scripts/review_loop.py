#!/usr/bin/env python3
"""MiniMax Code Review Loop - handles iterative code reviews (Refactored & Hardened)."""

import json
import os
import sys
import re
import urllib.request
from utils import call_minimax_api, extract_json, post_github_comment

def run_review_loop():
    api_url = os.environ.get('MINIMAX_API_URL', 'https://api.minimax.io/anthropic')
    api_key = os.environ.get('ANTHROPIC_API_KEY', '')
    model = os.environ.get('MODEL', 'MiniMax-M2.7')
    rounds = int(os.environ.get('ROUNDS', '3'))
    base_branch = os.environ.get('BASE_BRANCH', '')
    commit_count = os.environ.get('COMMIT_COUNT', '0')
    github_token = os.environ.get('GITHUB_TOKEN', '')
    repo = os.environ.get('GITHUB_REPOSITORY', '')
    pr_number = os.environ.get('PR_NUMBER', '0')

    try:
        with open('pr_diff.patch', 'r') as f:
            diff_content = f.read()
    except Exception as e:
        print(f"Warning: Could not read diff: {e}")
        diff_content = ""

    try:
        req = urllib.request.Request(
            f"https://api.github.com/repos/{repo}/pulls/{pr_number}",
            headers={
                "Authorization": f"token {github_token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28"
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            pr_data = json.loads(resp.read())
    except Exception as e:
        print(f"Warning: Could not fetch PR data: {e}", file=sys.stderr)
        pr_data = {"title": "PR", "body": "", "user": {"login": "unknown"}}

    pr_title = pr_data.get('title', 'No title')[:500]
    pr_body = pr_data.get('body', 'No description')[:2000]
    pr_author = pr_data.get('user', {}).get('login', 'unknown')

    system_prompt = (
        "You are an expert code reviewer. Respond ONLY with valid JSON "
        "(no markdown, no backticks). Required fields:\n"
        "- issues: array of {severity: \"critical\"|\"major\"|\"minor\", "
        "file?: string, line?: number, description: string}\n"
        "- suggestions: array of {file?: string, line?: number, description: string}\n"
        "- praises: array of strings\n"
        "- summary: string\n"
        "- approved: boolean\n"
        "- changesRequested: boolean"
    )

    all_issues = []
    changes_requested = False
    review_summary_parts = []

    for round_num in range(1, rounds + 1):
        print(f"\n{'='*50}\nReview Round {round_num} of {rounds}\n{'='*50}")

        prev_feedback = ""
        if all_issues:
            prev_lines = ["", "Previous review issues (consider but re-evaluate):"]
            for issue in all_issues:
                loc = f" in {issue['file']}" if issue.get('file') else ""
                if issue.get('line'): loc += f":{issue['line']}"
                prev_lines.append(f"- [{issue.get('severity', 'minor')}] {issue.get('description', '')}{loc}")
            prev_feedback = "\n".join(prev_lines)

        user_content = (
            f"Review this pull request:\n\nTitle: {pr_title}\nAuthor: {pr_author}\n"
            f"Base Branch: {base_branch}\nCommit Count: {commit_count}\n"
            f"Review Round: {round_num} of {rounds}\n\nDescription:\n{pr_body}\n\n"
            f"{prev_feedback}\n\nDiff:\n{diff_content[:15000]}\n\n"
            "Respond with ONLY a JSON object."
        )

        payload = {
            "model": model, 
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            "temperature": 0.3, 
            "max_tokens": 4000
        }

        try:
            response_body, _ = call_minimax_api(payload, api_key, api_url)
            review_data = extract_json(response_body)
            
            issues = review_data.get('issues', [])
            suggestions = review_data.get('suggestions', [])
            praises = review_data.get('praises', [])
            summary = review_data.get('summary', 'Review complete')
            approved = review_data.get('approved', False)
            changes_req = review_data.get('changesRequested', False)

            if changes_req:
                changes_requested = True

            all_issues.extend(issues)
            review_summary_parts.append(f"Round {round_num}: {summary[:100]}")

            verdict = "&#9989; **Approved**" if approved and not changes_req else "&#9888; **Changes Requested**"
            lines = [f"## MiniMax Code Review &#8212; Round {round_num}/{rounds}", "", "### Summary", summary, "", "### Verdict", verdict]
            if praises:
                lines.extend(["", "### Praises"])
                for p in praises[:5]: lines.append(f"- {p[:200]}")
            if issues:
                lines.extend(["", "### Issues"])
                for i in issues[:20]:
                    icon = '&#128308;' if i.get('severity') == 'critical' else ('&#128993;' if i.get('severity') == 'major' else '&#129514;')
                    loc = f"**{i['file']}{(':' + str(i['line'])) if i.get('line') else ''}** &#8212; " if i.get('file') else ""
                    lines.append(f"{icon} {loc}{i.get('description', '')[:200]}")
            if suggestions:
                lines.extend(["", "### Suggestions"])
                for s in suggestions[:20]:
                    loc = f"**{s['file']}{(':' + str(s['line'])) if s.get('line') else ''}** &#8212; " if s.get('file') else ""
                    lines.append(f"- {loc}{s.get('description', '')[:200]}")
            
            lines.extend(["", f"*Model: {model} | Powered by MiniMax API*"])
            post_github_comment(repo, pr_number, '\n'.join(lines), github_token)

        except Exception as e:
            print(f"Error in review round {round_num}: {e}")

    review_summary = " ".join(review_summary_parts)[:500]
    out_file = os.environ.get('GITHUB_OUTPUT', '/tmp/gha_output')
    with open(out_file, 'a') as f:
        f.write(f"all_rounds_complete=true\nchanges_requested={str(changes_requested).lower()}\nreview_summary={review_summary}\nreview_rounds={rounds}\n")

if __name__ == '__main__':
    run_review_loop()
