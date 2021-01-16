import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { accounts, journal } from "../data";
import { setJournalEntries, setAccounts, setUserInput } from "../actions";
import { parseCSV, parseUserInput } from "../utils";

function InputForm() {
  const dispatch = useDispatch();
  const [userInput, setUserInputText] = useState(
    "1000 5000 MAR-16 JUL-16 HTML"
  );

  useEffect(() => {
    dispatch(setJournalEntries(parseCSV(journal)));
    dispatch(setAccounts(parseCSV(accounts)));
  });

  const handleChange = (e) => {
    setUserInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();

    dispatch(setUserInput(parseUserInput(userInput)));
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="journal">Journal</label>
        <textarea
          className="form-control"
          id="journal"
          rows="3"
          value={journal}
          onChange={() => {}}
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="accounts">Accounts</label>
        <textarea
          className="form-control"
          id="accounts"
          rows="3"
          value={accounts}
          onChange={() => {}}
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="userInput">User input</label>
        <input
          type="text"
          className="form-control"
          id="userInput"
          value={userInput}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default InputForm;
