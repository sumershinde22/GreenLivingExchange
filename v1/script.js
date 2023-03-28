const initialPosts = [
  {
    id: 1,
    text: "Use a reusable bottle/cup for beverages on-the-go",
    location: "Shrewsbury",
    category: "reduce",
    votesAmazing: 24,
    votesGreen: 9,
    votesUnHelpful: 0,
  },
  {
    id: 2,
    text: "I am using old plastic bags, soda bottles, and milk jugs to store food",
    location: "London",
    category: "reuse",
    votesAmazing: 4,
    votesGreen: 5,
    votesUnHelpful: 30,
  },
  {
    id: 3,
    text: "Familiarize yourself with the recycling guidelines in your community and follow them.",
    location: "Boston",
    category: "recycle",
    votesAmazing: 35,
    votesGreen: 25,
    votesUnHelpful: 2,
  },
];

const shareButton = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
const postsList = document.querySelector(".posts-list");

postsList.innerHTML = "";

async function loadFacts() {
  const res = await fetch(
    "https://aalxystcwlvovcnhewxc.supabase.co/rest/v1/posts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbHh5c3Rjd2x2b3Zjbmhld3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg4NDkwODYsImV4cCI6MTk5NDQyNTA4Nn0.emV4U2rD70mMJztHSzV8b1nTPXahD-ErB4c4_Xt1CfY",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbHh5c3Rjd2x2b3Zjbmhld3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg4NDkwODYsImV4cCI6MTk5NDQyNTA4Nn0.emV4U2rD70mMJztHSzV8b1nTPXahD-ErB4c4_Xt1CfY",
      },
    }
  );
  const data = await res.json();
  // const filteredData = data.filter((fact) => fact.category === "technology");
  createFactsList(data);
}

function createFactsList(dataArray) {
  const htmlArr = dataArray.map(
    (post) => `<li class="post">
      <p>
      ${post.text}
      </p>
      <span class="tag" style="background-color: #4b6b4e">${post.category}</span>
    </li>`
  );
  const html = htmlArr.join("");
  postsList.insertAdjacentHTML("afterbegin", html);
}
loadFacts();

shareButton.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    shareButton.textContent = "Close";
  } else {
    form.classList.add("hidden");
    shareButton.textContent = "Share something";
  }
});
