# Yenilenen tasarım

- Ana sayfa: görselsiz hero, lacivert–mint renkler, belirgin tipografi, çalışmalar, mevcut yazı bağlantıları ve sosyal iletişim kanalları.
- Otobiyografi: `/otobiyografi.html`; altı bölüm, kaynak görselleri ve fotoğraf galerisi.
- Borsa ve teknik analiz: mevcut araçlar/API korunarak ortak görsel tema eklendi. Mobil grid taşması düzeltildi.
- Önceki iletişim formunun gönderim servisi veya işleyicisi yoktu. Ziyaretçilere başarılı gönderim izlenimi vermemek için mevcut sosyal iletişim bağlantıları kullanıldı.
- Ana sayfadaki mevcut Firebase Analytics entegrasyonu korundu.
- Vercel yapılandırması değişmedi: `public` statik içerik ve `api/kap-notifications.js` fonksiyonu.

Görsel ve etkileşim kontrolleri: dört sayfada masaüstü ve mobil; hero görseli yok; otobiyografi galerisi; teknik analiz pivot hesaplayıcısı. İzole tarayıcı kontrolünde üçüncü taraf ağ istekleri kapalıdır; canlı veri sağlayıcılarının servis durumu bu kontrolün kapsamında değildir.
