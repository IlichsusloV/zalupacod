export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ozonClientId, ozonApiKey } = req.body;
    if (!ozonClientId || !ozonApiKey) {
      return res.status(400).json({ error: 'Необходимо передать OZON ключи.' });
    }
    try {
      const response = await fetch('https://api-seller.ozon.ru/v2/reviews', {
        method: 'GET', // Если в вашей интеграции требуется другой метод – измените здесь
        headers: {
          'Client-Id': ozonClientId,
          'Api-Key': ozonApiKey,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: errorText });
      }
      const data = await response.json();
      // Предполагается, что реальные отзывы находятся в data.reviews. Проверьте структуру ответа!
      res.status(200).json({ reviews: data.reviews });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении отзывов' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Метод ${req.method} не разрешен`);
  }
}
