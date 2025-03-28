export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { reviewId, answer, ozonClientId, ozonApiKey } = req.body;
    if (!reviewId || !answer || !ozonClientId || !ozonApiKey) {
      return res.status(400).json({ error: 'Необходимы reviewId, ответ и OZON ключи.' });
    }
    try {
      const response = await fetch('https://api-seller.ozon.ru/v2/sendAnswer', {
        method: 'POST',
        headers: {
          'Client-Id': ozonClientId,
          'Api-Key': ozonApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          review_id: reviewId,
          answer_text: answer
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: errorText });
      }
      const data = await response.json();
      res.status(200).json({ message: 'Ответ успешно отправлен', data });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при отправке ответа' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Метод ${req.method} не разрешен`);
  }
}
