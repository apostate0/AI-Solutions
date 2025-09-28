export const handleEmailClick = (subject: string = '', body: string = '') => {
  // Check if it's a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  if (isMobile) {
    // On mobile, use mailto to open native app
    const mailtoUrl = `mailto:snehasama7@gmail.com${subject ? `?subject=${encodeURIComponent(subject)}` : ''}${body ? `&body=${encodeURIComponent(body)}` : ''}`
    window.location.href = mailtoUrl
  } else {
    // On desktop, open Gmail in new tab
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=snehasama7@gmail.com${subject ? `&su=${encodeURIComponent(subject)}` : ''}${body ? `&body=${encodeURIComponent(body)}` : ''}`
    window.open(gmailUrl, '_blank')
  }
}

export const createEmailClickHandler = (subject: string = '', body: string = '') => {
  return (e: React.MouseEvent) => {
    e.preventDefault()
    handleEmailClick(subject, body)
  }
}
