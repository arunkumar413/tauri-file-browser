## File browser

This is a simple tabular based file browser built using Rust+Reactjs using tauri.


## Features

1) Quick Filter for common files (Images,Vidoes,Sheets,PDFs,Docs)
2) Bookmarks on the sidebar
3) Sorting by date created, date modified and date accessed
4) Tabular data is organized in time buckets such as Today, Yesterday, Last week, This year.
5) Within each time buckets files are sorted by the file type and file name


## Screenshot
![screenshot-1](/src/screenshots/screenshot-1.png?raw=true)


![screenshot-2](/src/screenshots/screenshot-2.png?raw=true)





## 🛠️ Prerequisites

### Make sure these are installed:

#### 1. Node.js**
* Install latest LTS from Node.js (https://nodejs.org/en/download)
* **Verify:**
* `node -v`
* `npm -v`
#### 2. Rust

* Install via Rust (rustup):

* curl https://sh.rustup.rs -sSf | sh

Then:

* rustc -V
* cargo -V
#### 3. Tauri Prerequisites

**Follow official setup from Tauri:** (https://v2.tauri.app/start/prerequisites/)

On Linux (Ubuntu/Debian):
```
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
  ```

### Installation Steps
1. Clone the repo
git clone https://github.com/arunkumar413/tauri-file-browser.git
`cd tauri-file-browser`
2. `npm install` to install the frontend dependencies (Vite + React):


3.`npm run tauri dev` to run the app in development mode


This will:

1) Start Vite dev server
2) Compile Rust backend
3) Launch the desktop app
