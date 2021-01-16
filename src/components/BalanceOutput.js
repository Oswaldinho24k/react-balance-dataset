import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  dateToString,
  toCSV,
  setEntriesLabelandBalance,
  findByAccount,
  findByPeriod,
  getTotal,
} from "../utils";

class BalanceOutput extends Component {
  render() {
    if (!this.props.userInput.format) {
      return null;
    }

    return (
      <div className="output">
        <p>
          Total Debit: {this.props.totalDebit} Total Credit:{" "}
          {this.props.totalCredit}
          <br />
          Balance from account {this.props.userInput.startAccount ||
            "*"} to {this.props.userInput.endAccount || "*"} from period{" "}
          {dateToString(this.props.userInput.startPeriod)} to{" "}
          {dateToString(this.props.userInput.endPeriod)}
        </p>
        {this.props.userInput.format === "CSV" ? (
          <pre>{toCSV(this.props.balance)}</pre>
        ) : null}
        {this.props.userInput.format === "HTML" ? (
          <table className="table">
            <thead>
              <tr>
                <th>ACCOUNT</th>
                <th>DESCRIPTION</th>
                <th>DEBIT</th>
                <th>CREDIT</th>
                <th>BALANCE</th>
                <th>PERIOD</th>
              </tr>
            </thead>
            <tbody>
              {this.props.balance.map((entry, i) => (
                <tr key={i}>
                  <th scope="row">{entry.ACCOUNT}</th>
                  <td>{entry.DESCRIPTION}</td>
                  <td>{entry.DEBIT}</td>
                  <td>{entry.CREDIT}</td>
                  <td>{entry.BALANCE}</td>
                  <td>{dateToString(entry.PERIOD)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    );
  }
}

BalanceOutput.propTypes = {
  balance: PropTypes.arrayOf(
    PropTypes.shape({
      ACCOUNT: PropTypes.number.isRequired,
      DESCRIPTION: PropTypes.string.isRequired,
      DEBIT: PropTypes.number.isRequired,
      CREDIT: PropTypes.number.isRequired,
      BALANCE: PropTypes.number.isRequired,
    })
  ).isRequired,
  totalCredit: PropTypes.number.isRequired,
  totalDebit: PropTypes.number.isRequired,
  userInput: PropTypes.shape({
    startAccount: PropTypes.number,
    endAccount: PropTypes.number,
    startPeriod: PropTypes.date,
    endPeriod: PropTypes.date,
    format: PropTypes.string,
  }).isRequired,
};

export default connect(({ userInput, journalEntries, accounts }) => {
  const {
    endAccount,
    endPeriod,
    format,
    startAccount,
    startPeriod,
  } = userInput;

  const allEntries = setEntriesLabelandBalance({ accounts, journalEntries });
  const entriesByAccount = findByAccount({
    entries: allEntries,
    startAccount,
    endAccount,
  });

  const entriesByPeriod = findByPeriod({
    entries: entriesByAccount,
    startPeriod,
    endPeriod,
  });

  const totalCredit = getTotal({ entries: entriesByPeriod, key: "CREDIT" });

  const totalDebit = getTotal({ entries: entriesByPeriod, key: "DEBIT" });

  return {
    balance: entriesByPeriod,
    totalCredit,
    totalDebit,
    userInput: userInput,
  };
})(BalanceOutput);
