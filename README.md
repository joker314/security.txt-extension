# Security.txt Parser browser extension

## What is this?
This is a free (libre) browser extension. It should work on Chrome, Firefox, and Opera. When you ask it to, it searches a website for its [security.txt](https://securitytxt.org) file and shows it to you in a pretty-ish way.

## How to use / How does it work?
When you click on its icon, it'll check `/.well-known/security.txt`. If it doesn't give a good error code, it'll then check `security.txt`.

Once it's done that, it checks whether the origin changed. This would happen if the `security.txt` file redirected. If it has, it gives you a big warning.

Then, it lists each directive, together with their associated comments, and expands only the `Contact:` directive. It looks like this:

![Screenshot of the extension in action](https://user-images.githubusercontent.com/18113170/44701043-42101780-aa95-11e8-9703-30305c3af300.png)

The error is there because the protocol changed from `http` to `https`, and this is considered a new origin.

## How do I install it?
Until this appears in the Chrome, Firefox, or Opera webstores, you can install it manually. Search for "Load unpacked extension + BROWSER NAME".

## Why does it need all those permissions?
Same origin policy means it needs access to make requests. This is because the little popout is in a seperate origin to the page you're currrently viewing.

## What happens if the security.txt file is malformed?
It will show you just the raw text if it finds an invalid line.

## I've found a security issue.
Email me at jokebookyeye [ at symbol ] gmail [dot] com.

`javascript:` schemes in `Contact` fields are not vulnerabilities, so long as they open in a new tab. If you disagree, or are unsure, feel free to get in touch!