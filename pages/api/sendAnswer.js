// API-роут для отправки ответа через OZON Seller API (заглушка)
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { reviewId, answer, ozonClientId, ozonApiKey } = req.body;
    if (!reviewId || !answer || !ozonClientId || !ozonApiKey) {
      return res.status(400).json({ error: 'Отсутствуют reviewId, ответ или OZON ключи' });
    }
    // Здесь можно добавить вызов реального OZON Seller API с использованием переданных ключей
    res.status(200).json({ message: 'Ответ успешно отправлен' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Метод ${req.method} не разрешен`);
  }
}
