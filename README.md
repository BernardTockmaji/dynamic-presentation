# Presentation site

A two-page site for GitHub Pages:

- `index.html` is the public presentation page.
- `admin.html` is the editor. It isn't linked from the public page, but it is **not password protected**. It's fine for a proof of concept; don't put anything sensitive in it.

All text and layout lives in `content.json`. Images live in `images/`.

## Put it online

1. Create a new **public** repository on GitHub (for example `my-presentation`).
2. Click **Add file → Upload files**, drag in everything from this folder (including the `images` folder), and commit.
3. Go to **Settings → Pages**. Under "Build and deployment", pick **Deploy from a branch**, choose `main` and `/ (root)`, and save.
4. After a minute or two your site is live at `https://YOUR-USERNAME.github.io/my-presentation/`.
   The editor is at [`https://YOUR-USERNAME.github.io/my-presentation/admin.html`.](https://bernardtockmaji.github.io/dynamic-presentation/)

## Let the admin page save changes

The admin page saves by committing to your repo, so it needs a GitHub token:

1. On GitHub go to **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Under "Repository access" pick **Only select repositories** and choose this repo.
3. Under "Permissions → Repository permissions", set **Contents** to **Read and write**.
4. Generate the token, copy it, and paste it into **GitHub settings** at the bottom of the admin page. Owner and repository fill in automatically when the admin page runs on GitHub Pages.

The token is stored only in your browser. Anyone who has it can edit this repo, so don't share it.

After you click **Save changes**, GitHub Pages rebuilds and the public page updates in about a minute.

## Notes

- Removing an image from a container doesn't delete the file from `images/`. Delete unused files on GitHub if you want to tidy up.
- No token? Edit in the admin page, click **Download content.json**, and upload that file to the repo to replace the old one.
