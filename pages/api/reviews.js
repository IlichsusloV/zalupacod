// API-роут для получения отзывов (заглушка)
export default async function handler(req, res) {
  const dummyReviews = [
    { id: '1', text: 'Отличный товар, быстро доставили.' },
    { id: '2', text: 'Качество не соответствует описанию.' },
    { id: '3', text: 'Хорошая упаковка, но товар пришел поврежденным.' }
  ];
  res.status(200).json({ reviews: dummyReviews });
}
