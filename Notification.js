// Bildirim gönderme fonksiyonu
function sendNotification() {
  const notification = new Notification('Shop.co', {
    body: ' Shop.co is an online store that offers you affordable and deal products.',
    icon: 'favicon.png' // İsteğe bağlı, bir ikon ekleyebilirsiniz.
  });

  notification.onclick = () => {
    // Bildirime tıklanıldığında yapılacak işlemi buraya ekleyebilirsiniz.
    window.open('hedef-urlsi.com', '_blank');
    notification.close();
  };
}

// Bildirim izni iste
if ('Notification' in window && Notification.permission === 'granted') {
  sendNotification();
} else if ('Notification' in window && Notification.permission !== 'denied') {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      sendNotification();
    }
  });
}