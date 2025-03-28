export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { reviewText, openaiApiKey } = req.body;
    if (!reviewText || !openaiApiKey) {
      return res.status(400).json({ error: 'Необходимы текст отзыва и OpenAI API ключ.' });
    }
    // Здесь можно подключить реальный вызов к OpenAI API с использованием openaiApiKey.
    // В данном примере возвращается шаблонный ответ.
    const answer = `Спасибо за ваш отзыв: "${reviewText}". Мы обязательно учтем ваши пожелания!`;
    res.status(200).json({ answer });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Метод ${req.method} не разрешен`);
  }
}
