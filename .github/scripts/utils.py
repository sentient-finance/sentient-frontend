#!/usr/bin/env python3
"""Shared utilities for MiniMax AI Builder scripts."""

import json
import os
import sys
import re
import time
import subprocess
import urllib.request
import urllib.error

def run_command(command, cwd=None):
    """Run a shell command and return its output and return code."""
    process = subprocess.Popen(
        command, 
        shell=True, 
        stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE, 
        text=True,
        cwd=cwd
    )
    stdout, stderr = process.communicate()
    return stdout, stderr, process.returncode

def sanitize_path(path, base_dir=None):
    """
    Sanitize and validate a file path. 
    Prevents directory traversal and modification of sensitive files.
    """
    if not base_dir:
        # Default to repo root (assumed to be 2 levels up from .github/scripts)
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    
    abs_path = os.path.abspath(os.path.join(base_dir, path))
    
    if not abs_path.startswith(base_dir):
        raise ValueError(f"Security: Path {path} is outside of the repository root.")
    
    sensitive_patterns = [
        r'^\.github/',
        r'^\.git/',
        r'^package\.json$',
        r'^bun\.lock$',
        r'^yarn\.lock$',
        r'^package-lock\.json$',
        r'^\.env',
    ]
    
    rel_path = os.path.relpath(abs_path, base_dir)
    for pattern in sensitive_patterns:
        if re.search(pattern, rel_path):
            raise ValueError(f"Security: Modification of sensitive path {rel_path} is blocked.")
            
    return abs_path

def call_minimax_api(payload, api_key, api_url, timeout=120, max_retries=3, retry_delay=30):
    """Call MiniMax API with retries and rate limit handling."""
    for attempt in range(1, max_retries + 1):
        print(f"API attempt {attempt}")
        try:
            req = urllib.request.Request(
                api_url + "/v1/messages",
                data=json.dumps(payload).encode(),
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "anthropic-version": "2023-06-01"
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read().decode(), str(resp.status)
        except urllib.error.HTTPError as e:
            http_code = str(e.code)
            response_body = e.read().decode() if hasattr(e, 'read') else str(e)
            delay = retry_delay * (2 ** (attempt - 1))
            if http_code == "429":
                print(f"Rate limited (HTTP 429). Waiting {delay}s...")
                time.sleep(delay)
            elif http_code.startswith("5"):
                print(f"Server error (HTTP {http_code}). Waiting {delay}s...")
                time.sleep(delay)
            else:
                print(f"API error: HTTP {http_code}: {response_body[:200]}")
                if attempt < max_retries:
                    time.sleep(delay)
        except Exception as e:
            print(f"API connection error: {e}")
            if attempt < max_retries:
                time.sleep(retry_delay * (2 ** (attempt - 1)))
    
    raise RuntimeError(f"API failed after {max_retries} attempts.")

def extract_json(text):
    """Extract valid JSON from AI response text using regex."""
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if not match:
        raise ValueError("No valid JSON found in response.")
    
    try:
        data = json.loads(match.group())
        return data
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse extracted JSON: {e}")


