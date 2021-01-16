import React from "react";
import PropTypes from "prop-types";
import { dateToString } from "../utils";

function BalanceOutputTable({ balance }) {
  return (
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
        {balance.map((entry, i) => (
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
  );
}

BalanceOutputTable.propTypes = {
  balance: PropTypes.arrayOf(
    PropTypes.shape({
      ACCOUNT: PropTypes.number.isRequired,
      DESCRIPTION: PropTypes.string.isRequired,
      DEBIT: PropTypes.number.isRequired,
      CREDIT: PropTypes.number.isRequired,
      BALANCE: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default BalanceOutputTable;
