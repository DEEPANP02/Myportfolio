
$file = "c:\Users\Admin\Downloads\deepan-portfolio\src\App.jsx"
$enc = New-Object System.Text.UTF8Encoding($false)
$c = [System.IO.File]::ReadAllText($file, $enc)

# 1. Update the Google Fonts import - using more generic matching to avoid escaping issues
$c = $c -replace '@import url\(''https://fonts.googleapis.com/css2\?family=Bricolage[^'']+''\);', "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');"

# 2. Update global font-family
$c = $c -replace 'font-family: ''Bricolage Grotesque'',', "font-family: 'Plus Jakarta Sans',"

# 3. Update serif class
$c = $c -replace 'font-family: ''Instrument Serif'',[^;]+;', "font-family: 'Outfit', sans-serif;"
$c = $c -replace 'font-family: "''Instrument Serif'',[^"]+",', "font-family: 'Outfit', sans-serif,"
$c = $c -replace "fontFamily:\s*['\"']Instrument Serif['\"'],[^}]+}", 'fontFamily: "Outfit, sans-serif"}'

# 4. Fix Emojis in Data (Common sequences observed in view_file)
# We use regex or hex if possible, but let's try direct matches in the file
$map = @{
    'ðŸ“¦' = '📦'
    'ðŸŽ¨' = '🎨'
    'âš™ï¸ ' = '⚙️'
    'ðŸ—„ï¸ ' = '🗄️'
    'ðŸ“Š' = '📊'
    'ðŸ” ' = '🔍'
    'ðŸ§ª' = '🧪'
    'ðŸ¤ ' = '🤝'
    'ðŸŽ“' = '🎓'
    'â˜ ï¸ ' = '☁️'
    'âœ‰ï¸ ' = '📩'
    'ðŸ“ž' = '📞'
    'ðŸ’¼' = '💼'
    'ðŸ“ ' = '📍'
    'ðŸ¤Ÿ' = '🤟'
    'ðŸ“„' = '📄'
    'â€”' = '—'
    'Â·' = '·'
    'âœ¦' = '✧'
    'âœ•' = '✕'
    'â†—' = '↗'
    'â€”' = '—'
    'Â·' = '·'
}

foreach ($key in $map.Keys) {
    $c = $c.Replace($key, $map[$key])
}

[System.IO.File]::WriteAllText($file, $c, $enc)
Write-Host "Portfolio fonts and emojis fixed successfully."
