const ical = require("ical.js");

// for handling events that are recurring
function processEvent(eventComp) {
  const summary = eventComp.getFirstPropertyValue("summary");
  let start = eventComp.getFirstPropertyValue("dtstart").toJSDate();
  let end = eventComp.getFirstPropertyValue("dtend").toJSDate();
  const rrule = eventComp.getFirstPropertyValue("rrule");
  const events = [];

  if (rrule) {
    const untilDate = rrule.until ? rrule.until.toJSDate() : null;
    const count = rrule.count || Infinity;

    let iterations = 0;

    while ((!untilDate || start <= untilDate) && iterations < count) {
      events.push(createEvent(summary, start, end));

      if (rrule.freq === "WEEKLY") {
        start = addWeek(start);
        end = addWeek(end);
      }

      iterations++;
    }
  } else {
    events.push(createEvent(summary, start, end));
  }

  return events;
}

function createEvent(summary, start, end) {
  return {
    summary: summary,
    start: formatEventDate(start),
    end: formatEventDate(end),
  };
}

function addWeek(date) {
  return new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
}

function icalToJSON(json) {
  try {
    let allEvents = [];

    const jcalData = ical.parse(json);
    const comp = new ical.Component(jcalData);

    comp.getAllSubcomponents("vevent").forEach((eventComp) => {
      const eventsFromComp = processEvent(eventComp);
      allEvents = [...allEvents, ...eventsFromComp];
    });
    return allEvents;
  } catch (error) {
    new Error("Error fetching or processing iCal data");
  }
}

// the format in which date is stored in jCAL component is not easy to comprehend
function formatEventDate(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const nth = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const dayName = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[date.getMonth()];
  let hours = date.getHours();
  const minutes =
    date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();

  const amOrPm = hours >= 12 ? "PM" : "AM";
  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12; // midnight is 12 AM
  }

  return `${dayName} ${dayOfMonth}${nth(
    dayOfMonth,
  )} ${monthName} ${hours}:${minutes} ${amOrPm}`;
}

// Returns iCal
async function getICalFromURL(url) {
  // const webEvents = await ical.async.fromURL(url);
  const res = await fetch(
    `http://localhost:8080/api/get-ical?ical=${encodeURIComponent(url)}`,
  );
  return await res.text();
}

// Returns JSON
async function urlToJSON(url) {
  const ical = await getICalFromURL(url);
  return await icalToJSON(ical);
}

module.exports = { urlToJSON, icalToJSON, formatEventDate };
