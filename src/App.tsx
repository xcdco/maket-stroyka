import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type LeadFormProps = {
  title: string
  description: string
  buttonLabel: string
  compact?: boolean
}

type QuizStep = {
  key: string
  title: string
  options: string[]
}

type FaqItem = {
  question: string
  answer: string
}

const navItems = [
  { label: 'Рассчитать стоимость', href: '#calculator' },
  { label: 'Примеры работ', href: '#projects' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'О компании', href: '#company' },
  { label: 'Преимущества', href: '#advantages' },
  { label: 'Частые вопросы', href: '#faq' },
]

const services = [
  'Строительство домов',
  'Строительство пристроек',
  'Строительство бань',
  'Фасадные работы',
  'Кровельные работы',
  'Строительство фундамента',
  'Строительство отмостков',
  'Реставрация старых домов',
  'Строительство навесов',
  'Строительство гаражей',
  'Бетонные работы',
]

const stats = [
  { value: '17 лет', label: 'строим кровли под ключ в Москве и области' },
  { value: '4376+', label: 'объектов сдали за всё время работы' },
  { value: '24 часа', label: 'на выезд замерщика и запуск процесса' },
  { value: '3 года', label: 'официальная гарантия на работы и материалы' },
]

const BASE = import.meta.env.BASE_URL

const projectImages = [
  `${BASE}assets/44538883.jpg`,
  `${BASE}assets/44538899.jpg`,
  `${BASE}assets/44538909.jpg`,
  `${BASE}assets/44538915.jpg`,
  `${BASE}assets/44538929.jpg`,
  `${BASE}assets/44539053.jpg`,
]

const reviewCards = [
  {
    image: `${BASE}assets/33840398.png`,
    name: 'Михаил Нечаев',
    quote:
      'Этим летом решили сделать пристройку к дому. Очень довольны работой. Профессиональные строители, добросовестные люди. Всё было сделано в срок и качественно.',
  },
  {
    image: `${BASE}assets/33840402.png`,
    name: 'Александр Граков',
    quote:
      'Спасибо компании за грамотное решение вопросов в процессе работы. Помогли с выбором материалов, всё сделали быстро, аккуратно и без неприятных сюрпризов.',
  },
  {
    image: `${BASE}assets/33840405.png`,
    name: 'Екатерина Строганова',
    quote:
      'Приехали на следующий день, спокойно всё объяснили, вежливо ответили на вопросы и довели объект до сдачи без нареканий. Буду советовать знакомым.',
  },
]

const longReviews = [
  {
    image: `${BASE}assets/26764860.jpg`,
    name: 'Николай Осипов',
    text:
      'Мне нужна была бригада, способная адекватно составить смету, закупить материалы и построить объект в короткий срок. Выбрал эту команду по отзывам и гарантии по договору. Не ошибся.',
  },
  {
    image: `${BASE}assets/32336277.jpg`,
    name: 'Сергей Махно',
    text:
      'Все зависит от грамотного управляющего и опытных строителей. Здесь как раз тот случай: строят как себе, берутся даже за сложные и нестандартные объекты.',
  },
  {
    image: `${BASE}assets/41130295.jpg`,
    name: 'Артем Ступницкий',
    text:
      'Если еще сомневаетесь, не сомневайтесь. На этапе выбора комплектации подробно ответили на вопросы, а по цене предложение оказалось самым приятным.',
  },
]

const reasons = [
  {
    title: 'Отсутствие рисков',
    text: 'Оплачиваете поэтапно, а окончательный расчет делаете в конце работ. Стоимость фиксируем заранее.',
  },
  {
    title: 'Не дергаем по пустякам',
    text: 'Сами закупаем, доставляем и разгружаем материалы. Вы не тратите время на организационную рутину.',
  },
  {
    title: 'Исправим за свой счет',
    text: 'Если вдруг возникнет проблема, сразу приезжаем и устраняем её без споров и перекладывания ответственности.',
  },
  {
    title: 'Соблюдаем сроки',
    text: 'Работаем слаженно, не бездельничаем и ценим ваше время. Договоренности не остаются на словах.',
  },
  {
    title: 'Своя техника и инструмент',
    text: 'Вам не нужно беспокоиться о специнструменте, транспорте и расходниках. Всё берем на себя.',
  },
  {
    title: 'Соблюдаем чистоту',
    text: 'Работаем аккуратно, не оставляем мусора на участке и стараемся сохранить декор, насаждения и подходы к дому.',
  },
]

const faqItems: FaqItem[] = [
  {
    question: 'Сколько стоят кровельные работы?',
    answer:
      'Цена зависит от площади, конфигурации кровли, выбранного материала и состава работ. Базовые проекты стартуют примерно от 100 000 рублей, а точную смету мы считаем индивидуально.',
  },
  {
    question: 'Какие есть гарантии?',
    answer:
      'Даем официальную гарантию на материалы и работы 3 года. Сроки и стоимость фиксируем в договоре, поэтому цена не “уплывает” в процессе.',
  },
  {
    question: 'Какие сроки выполнения?',
    answer:
      'Сроки зависят от объема и сложности объекта. После замера и обсуждения проекта мы называем конкретный срок именно для вашей кровли.',
  },
  {
    question: 'Как происходит оплата?',
    answer:
      'Работаем по договору. Предоплата по сайту заявлена как 0 рублей: оплата начинается после доставки материала, а финальный расчет делается после приемки работ.',
  },
  {
    question: 'Где можно посмотреть ваши работы?',
    answer:
      'Часть объектов показана на этой странице. По запросу отправим дополнительные фото и видео в WhatsApp и пригласим на текущие стройки.',
  },
  {
    question: 'Можете предложить теплый вариант конструкции?',
    answer:
      'Да. Мы подбираем решения под сезонность и задачу, рассчитываем снеговые и ветровые нагрузки и предлагаем утепленные варианты.',
  },
]

const quizSteps: QuizStep[] = [
  {
    key: 'roofType',
    title: 'Какой тип кровли вас интересует?',
    options: ['Металлочерепица', 'Гибкая черепица', 'Фальцевая кровля', 'Наплавляемая кровля', 'Нужна консультация'],
  },
  {
    key: 'area',
    title: 'Какая примерная площадь кровли?',
    options: ['до 100 м2', '100–150 м2', '150–250 м2', '250–400 м2', 'более 400 м2'],
  },
  {
    key: 'stage',
    title: 'На какой стадии объект?',
    options: ['Новый дом', 'Реконструкция крыши', 'После протечки', 'Нужен ремонт узлов', 'Пока собираю варианты'],
  },
  {
    key: 'timeline',
    title: 'Когда хотите начать?',
    options: ['Как можно скорее', 'В течение месяца', 'Через месяц', 'В следующем сезоне'],
  },
]

function LeadForm({ title, description, buttonLabel, compact = false }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form className={`lead-form ${compact ? 'lead-form--compact' : ''}`} onSubmit={handleSubmit}>
      <div className="lead-form__copy">
        <p className="section-kicker">Быстрая консультация</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="lead-form__fields">
        <label>
          <span>Имя</span>
          <input name="name" type="text" placeholder="Как к вам обращаться" />
        </label>
        <label>
          <span>Телефон</span>
          <input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required />
        </label>
      </div>
      <button className="button button--primary" type="submit">
        {submitted ? 'Заявка принята' : buttonLabel}
      </button>
      <p className="lead-form__policy">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
      </p>
    </form>
  )
}

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [openFaq, setOpenFaq] = useState(0)

  const currentQuestion = quizSteps[currentStep]
  const currentAnswer = currentQuestion ? answers[currentQuestion.key] : undefined
  const isQuizComplete = currentStep >= quizSteps.length

  const quizSummary = useMemo(
    () =>
      quizSteps
        .map((step) => answers[step.key])
        .filter(Boolean)
        .join(' • '),
    [answers],
  )

  const handleOptionSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.key]: value }))
  }

  const handleContinue = () => {
    if (!currentAnswer) {
      return
    }

    setCurrentStep((prev) => prev + 1)
  }

  return (
    <div className="page-shell">
      <header className="header">
        <div className="topbar">
          <div className="brandline">
            <img className="brandline__logo" src={`${BASE}assets/logo.webp`} alt="Логотип компании" />
            <div>
              <p>Строительство кровли под ключ в Москве и области с 2007 года</p>
              <span>Режим работы с 07:00 до 22:00</span>
            </div>
          </div>
          <a className="topbar__phone" href="tel:+79163760077">
            8 (916) 376-00-77
          </a>
        </div>

        <div className="header__nav">
          <div className="service-strip">
            {services.map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>
          <nav>
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero__content">
            <p className="section-kicker">Займет не больше 1 минуты</p>
            <h1>Кровельные работы под ключ для частных домов в Москве и области</h1>
            <p className="hero__lead">
              Без предоплаты. Работаем 17 лет. Гарантия 3 года. Начнем работы моментально и
              посчитаем смету в 2–3 вариантах со скидкой до 19%.
            </p>
            <div className="hero__features">
              <div className="feature-chip">
                <img src={`${BASE}assets/hero-icon-1.webp`} alt="" />
                <span>Соблюдаем СНиП и ГОСТ, сами закупаем материалы</span>
              </div>
              <div className="feature-chip">
                <img src={`${BASE}assets/hero-icon-2.webp`} alt="" />
                <span>Фиксированная цена без доплат и своя техника на объекте</span>
              </div>
            </div>
            <div className="hero__actions">
              <a className="button button--primary" href="#calculator">
                Рассчитать стоимость в 3-х вариантах
              </a>
              <a className="button button--ghost" href="tel:+79163760077">
                Позвонить сейчас
              </a>
            </div>
            <div className="hero__stats">
              {stats.map((item) => (
                <article key={item.value} className="stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__frame">
              <img src={`${BASE}assets/hero-bg.webp`} alt="Загородный дом с новой кровлей" />
            </div>
          </div>
        </section>

        <section className="section section--light">
          <div className="section__heading">
            <p className="section-kicker">Смета за 1 минуту</p>
            <h2>Кровельные работы по низким ценам, недорого в Москве и области</h2>
            <p>
              В результате вы получите стоимость работ с материалами и без, консультацию
              специалиста и несколько вариантов решения под ваш бюджет.
            </p>
          </div>
          <div className="outcome-grid">
            <article>
              <strong>2–3 варианта сметы</strong>
              <p>Сравните конфигурации кровли и выберите баланс цены, срока и внешнего вида.</p>
            </article>
            <article>
              <strong>Скидка до 19%</strong>
              <p>Фиксируем актуальные условия месяца и сразу показываем, где реально сэкономить.</p>
            </article>
            <article>
              <strong>Компетентные советы</strong>
              <p>Подскажем по материалам, пирогу кровли, утеплению и узлам без навязывания.</p>
            </article>
          </div>
        </section>

        <section className="section calculator" id="calculator">
          <div className="section__heading">
            <p className="section-kicker">Калькулятор</p>
            <h2>Ответьте на 4 вопроса и получите расчёт стоимости кровельных работ</h2>
            <p>
              На этот номер мы отправим предварительный расчёт и закрепим скидку месяца. Форму
              можно пройти с телефона за минуту.
            </p>
          </div>
          <div className="quiz-card">
            {!isQuizComplete ? (
              <>
                <div className="quiz-card__progress">
                  <span>
                    Шаг {currentStep + 1} / {quizSteps.length}
                  </span>
                  <div className="quiz-card__track">
                    <div
                      className="quiz-card__fill"
                      style={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
                <h3>{currentQuestion.title}</h3>
                <div className="quiz-options">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={option === currentAnswer ? 'quiz-option is-active' : 'quiz-option'}
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="quiz-card__actions">
                  <button
                    className="button button--ghost"
                    type="button"
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                  >
                    Назад
                  </button>
                  <button
                    className="button button--primary"
                    type="button"
                    disabled={!currentAnswer}
                    onClick={handleContinue}
                  >
                    Далее
                  </button>
                </div>
              </>
            ) : (
              <div className="quiz-card__result">
                <p className="section-kicker">Готово</p>
                <h3>Подберем 2–3 варианта сметы под ваш запрос</h3>
                <p>{quizSummary}</p>
                <LeadForm
                  compact
                  title="Оставьте номер, и мы отправим расчёт"
                  description="Напишем в мессенджер или перезвоним, чтобы уточнить детали объекта и закрепить скидку."
                  buttonLabel="Получить расчет"
                />
              </div>
            )}
          </div>
        </section>

        <section className="section section--light" id="projects">
          <div className="section__heading">
            <p className="section-kicker">Примеры работ</p>
            <h2>Построили уже 4376 кровель за 17 лет, поэтому нам можно доверять</h2>
            <p>
              Можно записаться на экскурсию по текущим объектам или запросить дополнительные фото
              и видео по телефону 8 (916) 376-00-77.
            </p>
          </div>
          <div className="projects-grid">
            {projectImages.map((image, index) => (
              <article key={image} className="project-card">
                <img src={image} alt={`Пример кровельных работ ${index + 1}`} />
                <div className="project-card__meta">
                  <span>Объект {index + 1}</span>
                  <strong>Кровельные работы под ключ</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section reviews" id="reviews">
          <div className="section__heading">
            <p className="section-kicker">Отзывы</p>
            <h2>Делаем, как для себя, поэтому получаем 100% положительные отзывы от клиентов</h2>
            <p>Вы можете связаться с клиентами, которым мы уже строили и ремонтировали кровлю.</p>
          </div>
          <div className="reviews-grid">
            {reviewCards.map((review) => (
              <article key={review.name} className="review-card">
                <img src={review.image} alt={review.name} />
                <div>
                  <h3>{review.name}</h3>
                  <p>{review.quote}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="testimonial-banner">
            <div className="testimonial-banner__quote">
              <p className="section-kicker">Бесплатная консультация</p>
              <h3>Запишитесь и узнайте, как выгодно построить кровлю</h3>
              <p>
                Сразу подскажем по материалам, этапам монтажа и примерному бюджету без навязчивых
                звонков и обещаний “посчитать потом”.
              </p>
            </div>
            <div className="testimonial-list">
              {longReviews.map((review) => (
                <article key={review.name} className="mini-review">
                  <img src={review.image} alt={review.name} />
                  <div>
                    <strong>{review.name}</strong>
                    <p>{review.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--light company" id="company">
          <div className="company__content">
            <div className="section__heading section__heading--left">
              <p className="section-kicker">О компании</p>
              <h2>Занимаемся строительством кровли с 2007 года. Построили уже 4376+ объектов.</h2>
              <p>
                Меня зовут Сергей, я руководитель компании. Лучше обращаться к узкопрофильной
                команде, которая каждый день занимается кровлями, чем переплачивать за исправление
                ошибок случайной бригады.
              </p>
              <p>
                Приезжаем на замер-консультацию, даем точную смету, полезные советы и честно
                объясняем, что действительно нужно делать на объекте.
              </p>
            </div>
            <div className="company__visual">
              <img src={`${BASE}assets/41084908.png`} alt="Сергей, инженер-прораб" />
              <div className="company__badge">
                <strong>Сергей</strong>
                <span>Инженер-прораб</span>
              </div>
            </div>
          </div>
          <LeadForm
            title="Запишитесь на бесплатный замер"
            description="Поможем понять состав работ, стоимость материалов и реальный срок запуска без обязательств."
            buttonLabel="Записаться"
          />
        </section>

        <section className="section advantages" id="advantages">
          <div className="section__heading">
            <p className="section-kicker">Преимущества</p>
            <h2>6 причин, почему люди выбирают заказать монтаж кровли под ключ</h2>
            <p>
              Запишитесь на бесплатный замер, чтобы получить точный расчет. Звоните 8 (916)
              376-00-77.
            </p>
          </div>
          <div className="reasons-grid">
            {reasons.map((reason) => (
              <article key={reason.title} className="reason-card">
                <span className="reason-card__number">{reason.title[0]}</span>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </article>
            ))}
          </div>
          <LeadForm
            title="Узнайте стоимость кровельных работ в 3-х вариантах"
            description="Оставьте номер и получите предварительную смету, рекомендации по материалам и актуальные скидки."
            buttonLabel="Записаться"
          />
        </section>

        <section className="section section--light faq" id="faq">
          <div className="faq__intro">
            <div className="section__heading section__heading--left">
              <p className="section-kicker">Частые вопросы</p>
              <h2>Ответы на вопросы, которые нам чаще всего задают перед заказом кровельных работ</h2>
              <p>
                Если не нашли свой случай, напишите вопрос и получите развернутый ответ от
                эксперта по строительству кровли вашего дома.
              </p>
            </div>
            <LeadForm
              compact
              title="Остались вопросы?"
              description="Оставьте заявку или позвоните 8 (916) 376-00-77, и мы подскажем оптимальный вариант."
              buttonLabel="Задать вопрос"
            />
          </div>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <article
                key={item.question}
                className={openFaq === index ? 'faq-item is-open' : 'faq-item'}
              >
                <button type="button" onClick={() => setOpenFaq(index)}>
                  <span>{item.question}</span>
                  <span>{openFaq === index ? '−' : '+'}</span>
                </button>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section cta">
          <div className="cta__overlay" />
          <div className="cta__content">
            <div className="section__heading section__heading--left">
              <p className="section-kicker">Скидка месяца</p>
              <h2>Оставьте заявку и получите скидку 19% до конца месяца</h2>
              <p>
                Перезвоним, уточним задачу, закрепим акцию и подскажем, как выгоднее запустить
                работы именно на вашем объекте.
              </p>
            </div>
            <LeadForm
              compact
              title="Закрепить скидку"
              description="Подтвердим детали и отправим предложение удобным для вас способом."
              buttonLabel="Хочу скидку"
            />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <p className="section-kicker">Звоните прямо сейчас</p>
          <a href="tel:+79163760077">8 (916) 376-00-77</a>
          <span>Ежедневно с 07:00 до 22:00</span>
        </div>
        <div>
          <strong>Адрес офиса</strong>
          <p>г. Подольск, ул. Лобачева 13</p>
          <p>Михай Рустам Валериевич · ИНН 482419116023</p>
        </div>
        <div>
          <strong>Документы</strong>
          <a href="https://xn-----6kcbbfe7cjcpgvfeuqiics4t.xn--p1ai/files/policy_20250606132618.pdf">
            Политика конфиденциальности
          </a>
          <p>© 2017–2026 гг. Любая информация на сайте носит информационный характер.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
