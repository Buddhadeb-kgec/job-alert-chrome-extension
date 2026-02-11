const list = document.getElementById("jobList");

document.getElementById("loadJobs").addEventListener("click", async () => {
  const response = await fetch("https://raw.githubusercontent.com/Buddhadeb-kgec/job-data/main/jobs.json");

  const jobs = await response.json();

  list.innerHTML = "";

  jobs.forEach(job => {
    const li = document.createElement("li");

    const link = document.createElement("a");
    link.href = job.link;
    link.textContent = `${job.title} – ${job.company}`;
    link.target = "_blank";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "save-btn";
    saveBtn.onclick = () => saveJob(job);

    li.appendChild(link);
    li.appendChild(document.createTextNode(" "));
    li.appendChild(saveBtn);

    list.appendChild(li);
  });

  showSavedJobs();
});

function saveJob(job) {
  chrome.storage.local.get(["savedJobs"], result => {
    const saved = result.savedJobs || [];

    // prevent duplicates
    const alreadySaved = saved.some(j => j.link === job.link);
    if (alreadySaved) return;

    saved.push(job);

    chrome.storage.local.set({ savedJobs: saved }, () => {
      showSavedJobs();
    });
  });
}

function removeJob(linkToRemove) {
  chrome.storage.local.get(["savedJobs"], result => {
    let saved = result.savedJobs || [];

    saved = saved.filter(job => job.link !== linkToRemove);

    chrome.storage.local.set({ savedJobs: saved }, () => {
      list.innerHTML = "";
      document.getElementById("loadJobs").click();
    });
  });
}

function showSavedJobs() {
  chrome.storage.local.get(["savedJobs"], result => {
    const saved = result.savedJobs || [];

    if (saved.length === 0) return;

    const savedTitle = document.createElement("h3");
    savedTitle.textContent = "Saved Jobs 📌";

    list.appendChild(savedTitle);

    saved.forEach(job => {
      const li = document.createElement("li");

      const link = document.createElement("a");
      link.href = job.link;
      link.textContent = `${job.title} – ${job.company}`;
      link.target = "_blank";

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.className = "save-btn";
      removeBtn.onclick = () => removeJob(job.link);

      li.appendChild(link);
      li.appendChild(document.createTextNode(" "));
      li.appendChild(removeBtn);

      list.appendChild(li);
    });
  });
}
