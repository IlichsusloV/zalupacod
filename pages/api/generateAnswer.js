// API-роут для генерации ответа с помощью нейросети (заглушка)
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { reviewText, openaiApiKey } = req.body;
    if (!reviewText || !openaiApiKey) {
      return res.status(400).json({ error: 'Отсутствует текст отзыва или OpenAI API ключ' });
    }
    // Здесь можно добавить вызов реального API (например, OpenAI) с использованием openaiApiKey
    const answer = `Спасибо за ваш отзыв: "${reviewText}". Мы обязательно учтем ваши пожелания!`;
    res.status(200).json({ answer });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Метод ${req.method} не разрешен`);
  }
}
