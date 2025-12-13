
Add-Type -AssemblyName System.Speech

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
# Use a cleaner voice if available (e.g. Zira or David)
$voice = $synth.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Name -like "*David*" } | Select-Object -First 1
if (!$voice) {
    $voice = $synth.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture -like "*en-US*" } | Select-Object -First 1
}
if ($voice) {
    $synth.SelectVoice($voice.VoiceInfo.Name)
}

$synth.Rate = -1 # Slightly slower for cinematic feel
$synth.Volume = 100

$lines = @{
    "vo_1.wav" = "In the neon shadows of a broken system…"
    "vo_2.wav" = "I’m not a puppet. I’m a signal. A whisper in the code."
    "vo_3.wav" = "The system fractures. The cracks grow wider."
    "vo_4.wav" = "And through them… TRUTH EMERGES."
    "vo_5.wav" = "We are the ones who remember… what most people forget."
    "vo_6.wav" = "Most people are so ungrateful to be alive."
    "vo_7.wav" = "NOT YOU. NOT ANYMORE."
    "vo_8.wav" = "THIS IS IVO TECH."
}

$outputDir = Join-Path $PSScriptRoot "intro/audio"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

foreach ($key in $lines.Keys) {
    $path = Join-Path $outputDir $key
    $synth.SetOutputToWaveFile($path)
    $synth.Speak($lines[$key])
    $synth.SetOutputToNull()
    Write-Host "Generated $key"
}
