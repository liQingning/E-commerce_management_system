export const gettime = () => {
  let date = new Date().getHours()
  if (date >= 6 && date < 12) {
    return '上午'
  } else if (date >= 12 && date < 18) {
    return '下午'
  } else {
    return '晚上'
  }
}
