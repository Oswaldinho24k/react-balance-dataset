import React from "react";
import { useSelector } from "react-redux";
import {
  dateToString,
  toCSV,
  setEntriesLabelandBalance,
  findByAccount,
  findByPeriod,
  getTotal,
} from "../utils";

import { getUserInput } from "../reducers/userInput";
import { getAccounts } from "../reducers/accounts";
import { getJournalEntries } from "../reducers/journal";
import BalanceOutputTable from "./BalanceOutputTable";

function BalanceOutput() {
  //redux data
  const userInput = useSelector(getUserInput);
  const accounts = useSelector(getAccounts);
  const journalEntries = useSelector(getJournalEntries);
  const {
    format,
    endAccount,
    endPeriod,
    startAccount,
    startPeriod,
  } = userInput;

  //filtering entries by account
  const entriesByAccount = findByAccount({
    entries: journalEntries,
    startAccount,
    endAccount,
  });
  //filtering entries by period
  const entriesByPeriod = findByPeriod({
    entries: entriesByAccount,
    startPeriod,
    endPeriod,
  });
  //formatting all entries
  const formattedEntries = setEntriesLabelandBalance({
    accounts,
    entries: entriesByPeriod,
  });
  //getting totals
  const totalCredit = getTotal({ entries: formattedEntries, key: "CREDIT" });
  const totalDebit = getTotal({ entries: formattedEntries, key: "DEBIT" });

  if (!format) return null;

  return (
    <div className="output">
      <p>
        Total Debit: {totalDebit} Total Credit: {totalCredit}
        <br />
        Balance from account {startAccount || "*"} to {endAccount || "*"} from
        period {dateToString(startPeriod)} to {dateToString(endPeriod)}
      </p>
      {format === "CSV" ? <pre>{toCSV(formattedEntries)}</pre> : null}
      {format === "HTML" ? (
        <BalanceOutputTable balance={formattedEntries} />
      ) : null}
    </div>
  );
}

export default BalanceOutput;
