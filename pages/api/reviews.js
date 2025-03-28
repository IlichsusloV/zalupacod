export default async function handler(req, res) {
  // В этом примере ключи передаются из запроса или можно использовать сохранённые/переменные окружения
  const { ozonClientId, ozonApiKey } = req.body || {};

  try {
    const response = await fetch('https://api-seller.ozon.ru/v2/reviews', {
      method: 'GET', // или POST, если требуется
      headers: {
        'Client-Id': ozonClientId, // либо process.env.OZON_CLIENT_ID
        'Api-Key': ozonApiKey,     // либо process.env.OZON_API_KEY
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }
    
    const data = await response.json();
    // Предполагается, что данные отзывов находятся в data.reviews — проверьте структуру в документации
    res.status(200).json({ reviews: data.reviews });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении отзывов' });
  }
}
