# Author    
Aaron Hertner
30/12/2019
https://aaronhertner.github.io/aaronhertner/

# Source Files    
>assets
  ->icons
    ->mac
      -> icon
    ->png
      -> icon
    ->win
      -> icon
>pages
  ->mainpage.html
  ->page.js
>sounds
  ->*.wav
>styles
  ->mainStyle.css
>tunings
->main.js
->package-lock.json
->package.json
->README.txt

# How To Use
- run 'npm install' to install all dependencies
- to run navigate to the project directory and run 'npm start'
	-> or run 'npm run package-win' and then navigate to '/release_builds'
	-> from here run 'Tuna.exe' as normal
- tunings should be saved to the empty tuning directory so they can be loaded
  later
- to add new tones you must download a new .wav file, and set up an audio object
  in /pages/page.js
- click the buttons to hear the tones
