type SessionCopy = {
  name: string; heading: string; intro: string; detailHeading: string;
  paragraphs: string[]; questions: { question: string; answer: string }[];
};
type PhotoSession = {
  slug: string; description: string; images: string[];
  cz: SessionCopy; en: SessionCopy;
};

export const photoSessions: PhotoSession[] = [
  {
    slug: "rodinne-foceni",
    description: "Rodinné focení v Moravskoslezském kraji s Hanou Brabcovou. Přirozené fotografie rodičů a dětí v ateliéru nebo venku. Ukázky, průběh a ceník.",
    images: ["01-family-forest-portrait.jpg", "08-mother-sons-meadow-portrait.jpg", "19-father-son-close-portrait.jpg"],
    cz: {
      name: "Rodinné focení", heading: "Rodinné focení v Moravskoslezském kraji",
      intro: "Společná procházka, dětský smích i obyčejné objetí. Fotím vaši rodinu takovou, jaká je, bez nucených úsměvů a strojených póz. Vybrat si můžete focení venku nebo v ateliéru.",
      detailHeading: "Prostor pro děti i chvíle ve dvou",
      paragraphs: [
        "Při rodinném focení se střídají společné fotografie s menšími kombinacemi: rodiče s dětmi, sourozenci nebo blízký portrét s maminkou či tátou. Nemusíte celou dobu stát na jednom místě a dívat se do objektivu. Děti mají prostor pro pohyb a hru.",
        "Předem spolu probereme počet a věk dětí, představu o fotografiích a místo v Moravskoslezském kraji. Příroda nabízí prostor pro společnou procházku, v ateliéru zase více vyniknou výrazy a blízkost. Konkrétní místo i termín domluvíme při poptávce.",
        "Rozsah focení si vyberete podle své rodiny. Aktuální rodinné balíčky, počty fotografií a délku focení najdete v ceníku. Pokud si nejste jistí výběrem, napište mi, koho chcete fotografovat a co byste si chtěli uchovat."
      ],
      questions: [
        { question: "Musí děti umět pózovat?", answer: "Nemusí. Focení vedu přirozeně, s prostorem pro hru a společné chvíle. Nejde o to, aby se všichni nepřetržitě dívali do objektivu." },
        { question: "Fotíte v ateliéru i venku?", answer: "Ano, rodinné focení nabízím v ateliéru i v exteriéru. Místo vybereme podle vaší představy a zvoleného balíčku." },
        { question: "Kde najdu cenu rodinného focení?", answer: "Aktuální ceny a obsah balíčků jsou ve společném ceníku. Odkaz najdete níže; z balíčku můžete rovnou přejít k poptávce." }
      ]
    },
    en: {
      name: "Family photography", heading: "Family photography in the Moravian-Silesian Region",
      intro: "A walk together, children's laughter and an ordinary hug. I photograph your family naturally, without forced smiles or stiff poses, outdoors or in the studio.",
      detailHeading: "Room for children and moments together",
      paragraphs: [
        "Family sessions combine group photographs with smaller combinations: parents and children, siblings or a close portrait with mum or dad. Children have room to move and play instead of looking into the camera all the time.",
        "Beforehand we discuss your children's ages, the photographs you would like and a location in the Moravian-Silesian Region. Nature offers space for a walk; the studio brings expressions and closeness into focus. We agree on the place and date when you inquire.",
        "The pricing section lists current family packages, image counts and session lengths. If you are unsure which to choose, tell me who is coming and what you would like to remember."
      ],
      questions: [
        { question: "Do children need to know how to pose?", answer: "No. I guide the session naturally, with time for play and shared moments." },
        { question: "Can we choose the studio or outdoors?", answer: "Yes. We choose the setting based on your ideas and the selected package." },
        { question: "Where can I find the price?", answer: "Follow the pricing link below for current packages and their contents. Each package links to an inquiry." }
      ]
    }
  },
  {
    slug: "tehotenske-foceni",
    description: "Těhotenské focení v Moravskoslezském kraji. Jemné portréty nastávající maminky a společné fotografie s partnerem od Hany Brabcové. Ukázky a poptávka.",
    images: ["17-maternity-water-couple-landscape.jpg", "18-maternity-dog-river-landscape.jpg", "24-maternity-water-solo-landscape.jpg"],
    cz: {
      name: "Těhotenské focení", heading: "Těhotenské focení v Moravskoslezském kraji",
      intro: "Vzpomínka na dobu, kdy se těšíte na miminko. Zachytím vás samotnou i blízkost s partnerem přirozeně a citlivě, bez tlaku na dokonalé pózy.",
      detailHeading: "Vaše očekávání, váš způsob",
      paragraphs: [
        "Těhotenské fotografie mohou být tiché a jemné i plné společné radosti. V portfoliu najdete samostatné portréty nastávající maminky i fotografie páru v přírodě. Ukázky slouží jako inspirace; vaše focení nemusí kopírovat jejich místo ani podobu.",
        "Při domluvě mi napište, kdy miminko očekáváte, zda chcete přijít sama nebo s partnerem a jaké prostředí je vám blízké. Společně probereme termín a místo v Moravskoslezském kraji. Před focením doladíme potřebné podrobnosti, abyste věděla, co vás čeká.",
        "Nemusíte vědět, kam se postavit nebo co dělat s rukama. Focením vás provedu a nechám prostor přirozeným gestům. Pro domluvu rozsahu a ceny pošlete nezávaznou poptávku s představou o fotografiích."
      ],
      questions: [
        { question: "Může se přidat partner?", answer: "Ano, těhotenské focení může zahrnovat samostatné portréty i společné fotografie s partnerem. Napište mi při poptávce, kdo přijde." },
        { question: "Kdy si domluvit termín?", answer: "Napište mi očekávaný termín příchodu miminka a svou časovou představu. Konkrétní den spolu domluvíme podle dostupnosti a toho, co vám vyhovuje." },
        { question: "Musíme fotit u vody jako v ukázkách?", answer: "Ne. Fotografie u vody jsou příklady z portfolia. Prostředí vybereme společně podle vaší představy; focení ve vodě není podmínkou." }
      ]
    },
    en: {
      name: "Maternity photography", heading: "Maternity photography in the Moravian-Silesian Region",
      intro: "A memory of the time before your baby arrives. Gentle portraits of you and moments of closeness with your partner, without pressure to pose perfectly.",
      detailHeading: "Your anticipation, your way",
      paragraphs: [
        "Maternity photographs can feel quiet and gentle or full of shared joy. The portfolio includes individual portraits and couples outdoors. These are inspiration; your session does not have to copy their setting.",
        "Tell me when you are expecting your baby, who will join you and what surroundings you enjoy. We discuss a date and location in the Moravian-Silesian Region and cover the details beforehand.",
        "You do not need to know how to stand or what to do with your hands. I guide you while leaving room for natural gestures. Send a no-obligation inquiry to agree on the scope and price."
      ],
      questions: [
        { question: "Can my partner join?", answer: "Yes, the session can include individual portraits and photographs together. Tell me who will join when you inquire." },
        { question: "When should I arrange a date?", answer: "Tell me your expected due date and preferred timing. We agree on a day based on availability and your preferences." },
        { question: "Do we have to take photographs in water?", answer: "No. The water photographs are examples from the portfolio. We choose a setting together; entering the water is not required." }
      ]
    }
  },
  {
    slug: "newborn-foceni",
    description: "Newborn focení a focení miminek v Moravskoslezském kraji. Přirozené fotografie prvních společných měsíců s Hanou Brabcovou, doma nebo venku.",
    images: ["04-baby-sun-portrait.jpg", "05-baby-hands-bw-landscape.jpg", "06-mother-baby-portrait.jpg"],
    cz: {
      name: "Newborn a miminka", heading: "Newborn focení a miminka v Moravskoslezském kraji",
      intro: "Malé ruce, blízkost v náručí a první společné měsíce. Fotím miminka s důrazem na přirozené chvíle a vztahy ve vaší rodině, doma nebo venku.",
      detailHeading: "První příběhy v náručí",
      paragraphs: [
        "Na fotografiích nemusí být jen miminko samotné. Důležité jsou i chvíle, kdy ho držíte, díváte se na něj nebo jste jednoduše spolu. V ukázkách najdete jemné portréty, drobné detaily i blízkost maminky s miminkem.",
        "Při poptávce mi napište věk miminka, kdo se má focení účastnit a zda si představujete fotografie doma nebo venku. Místo v Moravskoslezském kraji, termín a rozsah spolu probereme předem. Focení stavím na klidném rytmu vaší rodiny.",
        "Nemusíte mít předem připravenou sérii póz ani přesný scénář. Podstatné jsou vaše společné okamžiky. Pokud si nejste jistí, zda vybrat focení miminka nebo celé rodiny, popište mi svou představu a domluvíme vhodný rozsah i cenu."
      ],
      questions: [
        { question: "Je focení jen pro novorozence?", answer: "Nabídka zahrnuje newborn i focení miminek v prvních měsících. Uveďte při poptávce věk dítěte, abychom podle něj domluvili průběh." },
        { question: "Můžeme být na fotografiích s miminkem?", answer: "Ano, blízkost rodičů s miminkem je součástí mého přirozeného stylu. Předem probereme, koho chcete do fotografií zapojit." },
        { question: "Kde focení probíhá?", answer: "Miminka fotím doma nebo venku. Konkrétní místo a vhodný termín domluvíme podle vaší představy a situace rodiny." }
      ]
    },
    en: {
      name: "Newborn & babies", heading: "Newborn and baby photography in the Moravian-Silesian Region",
      intro: "Tiny hands, a close embrace and your first months together. Natural photographs of babies and family connections, at home or outdoors.",
      detailHeading: "First stories in your arms",
      paragraphs: [
        "The photographs can include more than your baby alone: holding them, looking at them and simply being together. The examples show gentle portraits, little details and the closeness of a mother and baby.",
        "Tell me your baby's age, who you would like to include and whether you prefer home or outdoors. We discuss the location in the Moravian-Silesian Region, timing and scope beforehand, following your family's calm rhythm.",
        "You do not need a list of poses or a script. Your shared moments matter most. If you are unsure between a baby and family session, describe your ideas so we can agree on the scope and price."
      ],
      questions: [
        { question: "Is this only for newborns?", answer: "I photograph newborns and babies in their first months. Include your child's age in the inquiry so we can plan accordingly." },
        { question: "Can we be in the photographs with our baby?", answer: "Yes, closeness between parents and their baby is part of my natural approach. We discuss who to include beforehand." },
        { question: "Where does the session take place?", answer: "Baby sessions take place at home or outdoors. We agree on a location and date based on your ideas and family circumstances." }
      ]
    }
  }
];

export function findPhotoSession(slug: string) {
  return photoSessions.find((session) => session.slug === slug);
}
