//Create datatable
const columns = [
  { label: "Tytuł", field: "title" },
  { label: "Autor", field: "author" },
  { label: "Rodzaj", field: "genre" },
  { label: "Link", field: "link" },
];

const asyncTable = new mdb.Datatable(
  document.getElementById("datatable"),
  { columns },
  { loading: true }
);
//get the Api's for multiple fetching
const array = [
  fetch("https://wolnelektury.pl/api/books/"),
  fetch("https://wolnelektury.pl/api/authors/"),
  fetch("https://wolnelektury.pl/api/genres/"),
  fetch("https://wolnelektury.pl/api/epochs/"),
];

//adding rows into datatable
fetch("https://wolnelektury.pl/api/books/")
  .then((response) => response.json())
  .then((data) => {
    asyncTable.update(
      {
        rows: data.map((book) => ({
          title: book.title,
          author: book.author,
          genre: book.genre,
          link: `<a href='${book.url}'>Przeczytaj tekst</a>`,
        })),
      },
      { loading: false }
    );
  });

//Making cards for authors with most of texts on site and filling the charts with data
let cards = document.getElementById("cards");
async function fillData() {
  try {
    const responses = await Promise.all(array);
    const data = await Promise.all(
      responses.map((response) => response.json())
    );
    //cards with authors
    let authors = [];
    data[1].forEach((author) => {
      let i = 0;
      data[0].forEach((book) => {
        if (author.name == book.author) {
          i++;
        }
      });
      authors.push({
        name: author.name,
        count: i,
      });
    });
    authors.sort((a, b) => b.count - a.count);
    for (let i = 0; i < 3; i++) {
      cards.innerHTML += `
      <div class="col-xs-8 col-sm-8 col-md-4 col-lg-3">
        <div class="card shadow-2 t-${i} ">
          <div class="card-body">
            <h5 class="card-title">${authors[i].name}</h5>
            <p class="card-text">Ilość tekstów: ${authors[i].count}</p>
          </div>
        </div>
      </div>
      `;
    }
    //cards making end

    //filling the first chart
    let threeGenres = [];
    data[2].forEach((genre) => {
      let i = 0;
      let nazwa = genre.name;
      data[0].forEach((book) => {
        let nazwaR = book.genre;
        if (nazwa.toLowerCase() == nazwaR.toLowerCase()) {
          i++;
        }
      });
      threeGenres.push({
        name: nazwa,
        count: i,
      });
    });
    threeGenres.sort((a, b) => b.count - a.count);
    const dataBar = {
      type: "bar",
      data: {
        labels: [
          threeGenres[0].name,
          threeGenres[1].name,
          threeGenres[2].name,
          threeGenres[3].name,
          threeGenres[4].name,
        ],
        datasets: [
          {
            label: "Rodzaje",
            data: [
              threeGenres[0].count,
              threeGenres[1].count,
              threeGenres[2].count,
              threeGenres[3].count,
              threeGenres[4].count,
            ],
            backgroundColor: [
              "rgba(0, 180, 180, 0.6)",
              "rgba(0, 180, 180, 0.6)",
              "rgba(0, 180, 180, 0.6)",
            ],
          },
        ],
      },
    };

    new mdb.Chart(document.getElementById("chart-bar"), dataBar);
    //
    // filling the second chart
    let genres = [];
    data[3].forEach((genre) => {
      let i = 0;
      let rodzaj = genre.name;
      data[0].forEach((book) => {
        let nazwa = book.epoch;
        if (rodzaj.toLowerCase() == nazwa.toLowerCase()) {
          i++;
        }
      });
      genres.push({
        name: rodzaj,
        count: i,
      });
    });
    genres.sort((a, b) => b.count - a.count);

    const dataDoughnut = {
      type: "doughnut",
      data: {
        labels: [
          genres[0].name,
          genres[1].name,
          genres[2].name,
          genres[3].name,
          genres[4].name,
        ],
        datasets: [
          {
            label: "Epoki",
            data: [
              genres[0].count,
              genres[1].count,
              genres[2].count,
              genres[3].count,
              genres[4].count,
            ],
            backgroundColor: [
              "rgba(63, 81, 181, 0.5)",
              "rgba(77, 182, 172, 0.5)",
              "rgba(66, 133, 244, 0.5)",
              "rgba(156, 39, 176, 0.5)",
              "rgba(233, 30, 99, 0.5)",
              "rgba(66, 73, 244, 0.4)",
              "rgba(66, 133, 244, 0.2)",
            ],
          },
        ],
      },
    };

    new mdb.Chart(document.getElementById("doughnut-chart"), dataDoughnut);
  } catch {
    console.error("Multiple fetch failed");
  }
}

fillData();
