import { useState, useEffect } from 'react';

export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [generatedAnswers, setGeneratedAnswers] = useState({});
  const [loading, setLoading] = useState({});
  const [apiKeys, setApiKeys] = useState({
    ozonClientId: '',
    ozonApiKey: '',
    openaiApiKey: ''
  });
  const [keysSaved, setKeysSaved] = useState(false);

  // При загрузке пытаемся получить сохранённые ключи из localStorage
  useEffect(() => {
    const storedKeys = localStorage.getItem('apiKeys');
    if (storedKeys) {
      setApiKeys(JSON.parse(storedKeys));
      setKeysSaved(true);
    }
  }, []);

  // Обработка формы сохранения ключей
  const handleKeysSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    setKeysSaved(true);
  };

  // После сохранения ключей загружаем отзывы (в примере – заглушка)
  useEffect(() => {
    if (keysSaved) {
      fetch('/api/reviews')
        .then((res) => res.json())
        .then((data) => setReviews(data.reviews))
        .catch((err) => console.error('Ошибка при получении отзывов', err));
    }
  }, [keysSaved]);

  // Генерация ответа с передачей openaiApiKey
  const handleGenerate = async (reviewId, reviewText) => {
    setLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const res = await fetch('/api/generateAnswer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewText, openaiApiKey: apiKeys.openaiApiKey })
      });
      const data = await res.json();
      setGeneratedAnswers((prev) => ({ ...prev, [reviewId]: data.answer }));
    } catch (error) {
      console.error('Ошибка при генерации ответа', error);
    }
    setLoading((prev) => ({ ...prev, [reviewId]: false }));
  };

  // Отправка ответа с передачей OZON ключей
  const handleSendAnswer = async (reviewId) => {
    const answer = generatedAnswers[reviewId];
    if (!answer) return;
    try {
      const res = await fetch('/api/sendAnswer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId,
          answer,
          ozonClientId: apiKeys.ozonClientId,
          ozonApiKey: apiKeys.ozonApiKey
        })
      });
      const data = await res.json();
      alert('Ответ успешно отправлен!');
    } catch (error) {
      console.error('Ошибка при отправке ответа', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Генерация ответов на отзывы Ozon</h1>

      {/* Форма ввода API ключей */}
      {!keysSaved && (
        <form onSubmit={handleKeysSubmit} style={{ marginBottom: '2rem' }}>
          <div>
            <label>
              OZON Client ID:{' '}
              <input
                type="text"
                value={apiKeys.ozonClientId}
                onChange={(e) =>
                  setApiKeys({ ...apiKeys, ozonClientId: e.target.value })
                }
              />
            </label>
          </div>
          <div>
            <label>
              OZON API Key:{' '}
              <input
                type="text"
                value={apiKeys.ozonApiKey}
                onChange={(e) =>
                  setApiKeys({ ...apiKeys, ozonApiKey: e.target.value })
                }
              />
            </label>
          </div>
          <div>
            <label>
              OpenAI API Key:{' '}
              <input
                type="text"
                value={apiKeys.openaiApiKey}
                onChange={(e) =>
                  setApiKeys({ ...apiKeys, openaiApiKey: e.target.value })
                }
              />
            </label>
          </div>
          <button type="submit">Сохранить ключи</button>
        </form>
      )}

      {/* Если ключи сохранены, отображаем отзывы */}
      {keysSaved && reviews.length === 0 && <p>Отзывов не найдено.</p>}
      {keysSaved &&
        reviews.map((review) => (
          <div
            key={review.id}
            style={{
              border: '1px solid #ccc',
              marginBottom: '1rem',
              padding: '1rem'
            }}
          >
            <p>
              <strong>Отзыв:</strong> {review.text}
            </p>
            <button
              onClick={() => handleGenerate(review.id, review.text)}
              disabled={loading[review.id]}
            >
              {loading[review.id] ? 'Генерация...' : 'Сгенерировать ответ'}
            </button>
            {generatedAnswers[review.id] && (
              <div>
                <p>
                  <strong>Сгенерированный ответ:</strong>{' '}
                  {generatedAnswers[review.id]}
                </p>
                <button onClick={() => handleSendAnswer(review.id)}>
                  Отправить ответ
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

