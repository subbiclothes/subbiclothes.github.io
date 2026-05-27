(function () {
  const DUCK_QUOTES = {
    en: [
      { t: '"To quack or not to quack — that is the question."',                         a: '— Quilliam Shakesponk' },
      { t: '"I think, therefore I quack."',                                               a: '— René Duckcartes' },
      { t: '"The only thing we have to fear is running out of bread crumbs."',            a: '— Franklin Ducksevelt' },
      { t: '"Float like a duck, sting like... also a duck."',                             a: '— Muhaquack Ali' },
      { t: '"In the middle of every pond lies opportunity."',                             a: '— Albert Duckstein' },
      { t: '"Be the change you wish to see in the pond."',                                a: '— Mahatma Quackdhi' },
      { t: '"That which does not drown a duck only makes it wetter."',                   a: '— Friedrich Quacktsche' },
      { t: '"The pond is vast. The bread is finite. Quack wisely."',                     a: '— Sun Quack, The Art of Pond' },
      { t: '"The difference between an alcoholic and a duck is that the duck knows how to float."', a: '— Anonymous Duck' },
      { t: '"Have you heard of the Boopcube? Ducks were using it before it was cool."',  a: '— Innovative Duck, circa 2019' },
      { t: '"The duck recommends The Glorious Sword. It has no hands, yet somehow plays it."', a: '— Certified Duck Testimonial' },
      { t: '"\'Someday I\'ll update this,\' said the duck. It was 1987."',               a: '— Procrastinating Duck' },
      { t: '"The duck also hates editing images. That\'s why God gave it feathers instead of fingers."', a: '— Genesis of Ducks, 4:2' },
      { t: '"The duck not in the Discord is a duck without a pond. Join."',              a: '— Advice from the Grand Duck' },
      { t: '"Praising ducks is not a suggestion. It is a cosmic obligation."',           a: '— Ancient Duck Proverb' },
      { t: '"This message has been reviewed, approved, and quack-signed by a certified duck."', a: '— Official Duck Office' },
    ],
    es: [
      { t: '"Graznar o no graznar, esa es la cuestión."',                                a: '— Quilliam Shakesponk' },
      { t: '"Pienso, luego grazno."',                                                     a: '— René Patocartés' },
      { t: '"Lo único que debemos temer es quedarnos sin migas de pan."',                a: '— Franklin Patosevelt' },
      { t: '"Flota como un pato, pica como... también un pato."',                        a: '— Muhagrazno Alí' },
      { t: '"En el centro de todo estanque yace la oportunidad."',                       a: '— Albert Patostein' },
      { t: '"Sé el cambio que quieres ver en el estanque."',                             a: '— Mahatma Grazndi' },
      { t: '"Lo que no ahoga a un pato, solo lo moja más."',                             a: '— Friedrich Graznsche' },
      { t: '"El estanque es vasto. El pan es finito. Grazna con sabiduría."',            a: '— Sun Grazno, El Arte del Estanque' },
      { t: '"La diferencia entre un alcohólico y un pato es que el pato sabe flotar."', a: '— Pato Anónimo' },
      { t: '"¿Has oído hablar del Boopcube? Los patos lo usaban antes de que fuese popular."', a: '— Pato Innovador, circa 2019' },
      { t: '"El pato recomienda The Glorious Sword. No tiene manos, pero de algún modo lo juega."', a: '— Testimonio de Pato Certificado' },
      { t: '"\'Algún día actualizaré esto\', dijo el pato. Era 1987."',                  a: '— Pato Procrastinador' },
      { t: '"El pato también odia editar imágenes. Por eso Dios le dio plumas en lugar de dedos."', a: '— Génesis de los Patos, 4:2' },
      { t: '"El pato que no está en el Discord es un pato sin estanque. Únete."',        a: '— Consejo del Gran Pato' },
      { t: '"Alabar a los patos no es una sugerencia. Es una obligación cósmica."',      a: '— Proverbio Ancestral del Pato' },
      { t: '"Este mensaje ha sido revisado, aprobado y quack-firmado por un pato certificado."', a: '— Oficina Oficial de Patos' },
    ]
  };

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  shuffle(DUCK_QUOTES.en);
  shuffle(DUCK_QUOTES.es);

  let clicks = 0;
  let quoteIdx = 0;
  let nextAt = 50;
  let hideTimer = null;

  function nextThreshold() {
    return clicks + Math.floor(Math.random() * 49) + 2;
  }

  function playQuack() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1100, t);
      osc.frequency.exponentialRampToValueAtTime(580, t + 0.13);
      osc.frequency.linearRampToValueAtTime(640, t + 0.21);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 3.5;
      filter.frequency.setValueAtTime(1500, t);
      filter.frequency.exponentialRampToValueAtTime(680, t + 0.21);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.38, t + 0.022);
      gain.gain.setValueAtTime(0.38, t + 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.26);
      osc.onended = () => ctx.close();
    } catch (e) {}
  }

  function showQuote(q) {
    playQuack();
    const overlay = document.getElementById('duckQuoteOverlay');
    document.getElementById('duckQuoteText').textContent = q.t;
    document.getElementById('duckQuoteAuthor').textContent = q.a;
    overlay.classList.add('duck-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      overlay.classList.remove('duck-visible');
    }, 8250);
  }

  window.duckClick = function () {
    clicks++;
    if (clicks >= nextAt) {
      const pool = DUCK_QUOTES[typeof lang !== 'undefined' ? lang : 'en'] || DUCK_QUOTES.en;
      showQuote(pool[quoteIdx % pool.length]);
      quoteIdx++;
      nextAt = nextThreshold();
    }
  };
})();
