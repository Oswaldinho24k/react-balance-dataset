export const stringToDate = (str) => {
  if (str === "*") {
    return new Date(str);
  }

  const [month, year] = str.split("-");
  return new Date(`${month} 1 20${year}`);
};

export const dateToString = (d) => {
  if (isNaN(d.valueOf())) {
    return "*";
  }

  const [_, month, __, year] = d.toString().split(" ");
  return `${month.toUpperCase()}-${year.slice(2, 4)}`;
};

export const parseCSV = (str) => {
  let [headers, ...lines] = str.split(";\n");

  headers = headers.split(";");

  return lines.map((line) => {
    return line.split(";").reduce((acc, value, i) => {
      if (["ACCOUNT", "DEBIT", "CREDIT"].includes(headers[i])) {
        acc[headers[i]] = parseInt(value, 10);
      } else if (headers[i] === "PERIOD") {
        acc[headers[i]] = stringToDate(value);
      } else {
        acc[headers[i]] = value;
      }
      return acc;
    }, {});
  });
};

export const toCSV = (arr) => {
  let headers = Object.keys(arr[0]).join(";");
  let lines = arr.map((obj) => Object.values(obj).join(";"));
  return [headers, ...lines].join(";\n");
};

export const parseUserInput = (str) => {
  const [startAccount, endAccount, startPeriod, endPeriod, format] = str.split(
    " "
  );

  return {
    startAccount: parseInt(startAccount, 10),
    endAccount: parseInt(endAccount, 10),
    startPeriod: stringToDate(startPeriod),
    endPeriod: stringToDate(endPeriod),
    format,
  };
};

/**
 *
 * @param {object} params - params
 * @param {array} params.journalEntries - array of Journal Entries
 * @param {array} params.accounts - array of accounts
 *
 * setEntriesLabelandBalance is a function that returns a new array with the correct format used by the OutputTable adding labels and balance
 */

export const setEntriesLabelandBalance = ({ journalEntries, accounts }) => {
  return journalEntries.map((entry) => {
    const correspondingAccount = accounts.find(
      (acc) => acc.ACCOUNT === entry.ACCOUNT
    );
    const DESCRIPTION =
      (correspondingAccount && correspondingAccount.LABEL) || "---";
    const BALANCE = entry.DEBIT - entry.CREDIT;
    return {
      ...entry,
      DESCRIPTION,
      BALANCE,
    };
  });
};

/**
 *
 * @param {object} params - params
 * @param {array} params.entries - array of Journal Entries
 * @param {number} params.startAccount - first account of source
 * @param {number} params.endAccount - last account of source
 *
 * FindByAccount is a function that returns a filtered array based on account params you recive from input,
 */
export const findByAccount = ({ entries, startAccount, endAccount }) => {
  const start = isNaN(startAccount) ? 0 : startAccount;
  const end = isNaN(endAccount) ? Number.MAX_SAFE_INTEGER : endAccount;

  return entries.filter(
    (entry) => entry.ACCOUNT >= start && entry.ACCOUNT <= end
  );
};

/**
 *
 * @param {object} params - params
 * @param {array} params.entries - array of Journal Entries
 * @param {date} params.startPeriod - first account of source
 * @param {date} params.endPeriod - last account of source
 *
 * FindByPeriod is a function that returns a filtered array based on period params you recive from input,
 */
export const findByPeriod = ({ entries, startPeriod, endPeriod }) => {
  const start = isNaN(Date.parse(startPeriod)) ? new Date(0) : startPeriod;
  const end = isNaN(Date.parse(endPeriod)) ? new Date() : endPeriod;

  return entries.filter(
    (entry) => entry.PERIOD >= start && entry.PERIOD <= end
  );
};

/**
 *
 * @param {object} params - params
 * @param {array} params.entries - array of Journal Entries
 * @param {string} params.key - object key
 *
 * getTotal is a function that returns the sum of the given key from an array of objects
 */
export const getTotal = ({ entries, key }) => {
  return entries.reduce((acc, entry) => acc + entry[key], 0);
};
