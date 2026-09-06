import styles from './NoFiles.module.css'

export default function NoFiles() {
  return (
    <div className={styles.container}>
      <svg
        className={styles.folderSvg}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tylna część folderu */}
        <path
          d="M20 38C20 34.6863 22.6863 32 26 32H44.1716C45.7628 32 47.2889 32.6321 48.4142 33.7574L54.5858 39.9289C55.7111 41.0543 57.2372 41.6863 58.8284 41.6863H94C97.3137 41.6863 100 44.3726 100 47.6863V88C100 91.3137 97.3137 94 94 94H26C22.6863 94 20 91.3137 20 88V38Z"
          fill="#E2E8F0"
        />

        {/* Przednia część folderu */}
        <path
          d="M16 48C16 43.5817 19.5817 40 24 40H96C100.418 40 104 43.5817 104 48V88C104 92.4183 100.418 96 96 96H24C19.5817 96 16 92.4183 16 88V48Z"
          fill="#CBD5E1"
        />

        {/* Oczy */}
        <circle cx="48" cy="64" r="3.5" fill="#64748B" />
        <circle cx="72" cy="64" r="3.5" fill="#64748B" />

        {/* Uśmiech */}
        <path
          d="M52 74C52 74 55.5 78 60 78C64.5 78 68 74 68 74"
          stroke="#64748B"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <span className={styles.text}>No files yet. Drag and drop something here</span>
    </div>
  )
}