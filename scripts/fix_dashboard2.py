path = '/home/benbond/Documents/spinrec/src/app/artist/dashboard/page.tsx'
with open(path, 'r') as f:
    lines = f.readlines()

# Find where the SubmissionsList component ends (after the /> on the SubmissionsList)
# and remove all the orphan inline JSX after it until the </div> and </main>
output_lines = []
skip_mode = False
found_submissions_list = False
submissions_list_end = -1

for i, line in enumerate(lines):
    if '<SubmissionsList' in line:
        found_submissions_list = True
    if found_submissions_list and '/>' in line and 'SubmissionsList' not in line:
        # This is the end of the SubmissionsList component tag
        submissions_list_end = i
        break

if submissions_list_end > 0:
    # Keep everything up to and including the SubmissionsList closing tag
    output_lines = lines[:submissions_list_end + 1]
    # Skip the orphan inline JSX and add the closing tags directly
    # Find where the old inline list ends (the </div> before </main>)
    for i in range(submissions_list_end + 1, len(lines)):
        if lines[i].strip() == '</div>' and i + 1 < len(lines) and '</main>' in lines[i+1]:
            output_lines.append(lines[i])  # Keep this closing </div>
            output_lines.append(lines[i+1])  # Keep </main>
            break
    # Also keep the closing </div> for the content div before main
    for i in range(len(output_lines) - 1, -1, -1):
        if 'max-w-6xl mx-auto' in output_lines[i]:
            output_lines.insert(i + 1, '      </main>\n')
            break
    final_output = ''.join(output_lines)
    
    # Clean up duplicate closing tags
    final_output = final_output.replace('</main>\n      </main>', '</main>')
    final_output = final_output.replace('    </div>\n  );\n}\n', '    </div>\n  );\n}\n')
    
    with open(path, 'w') as f:
        f.write(final_output)
    print(f'Cleaned up dashboard: kept {len(output_lines)} lines')
else:
    print('Could not find SubmissionsList component')
    print('Lines around expected area:')
    for i in range(len(lines)):
        if 'SubmissionsList' in lines[i] or 'SubmissionsFilter' in lines[i]:
            print(f'  {i}: {lines[i].rstrip()}')
