import style from './SkeletonFile.module.css'

const SkeletonFile = () => {

  return (
    <div
      className={style.skeletonFile}
    >
      <div className={style.skeleton + ' ' + style.skeletonIcon} />
      <div className={style.skeleton + ' ' + style.skeletonTitle} />
    </div>
  )
}

export default SkeletonFile
