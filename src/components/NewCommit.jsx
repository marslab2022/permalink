import '../App.css';

import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { ProgressSpinner } from './ProgressSpinner';
import { useEffect } from 'react';
import { update } from '../lib/api';

export const NewCommit = (props) => {
  const [url, setUrl] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [version, setVersion] = React.useState("");
  const [isCommitting, setIsCommitting] = React.useState(false);
  const [interactionResult, setInteractionResult] = React.useState("");

  useEffect(async () => {
  }, []);

  async function onSubmitButtonClicked() {
    setInteractionResult("");
    setIsCommitting(true);
    update(url, version, description).then(ret => {
      setIsCommitting(false);
      if (ret.status === false) {
        setInteractionResult(ret.result);
      } else {
        setInteractionResult("Submit success");
      }
    });
  }

  return (
    <div>
      <div className="blank"></div>
      <div className="darkRow">Url:</div>
      <div className="newCommit">
        <TextareaAutosize
          value={url}
          onChange={e => setUrl(e.target.value)}
          rows="1" 
          placeholder="e.g. https://www.arweave.org"
        />
      </div>
      <div className="blank"></div>
      <div className="darkRow">Version:</div>
      <div className="newCommit">
        <TextareaAutosize
          value={version}
          onChange={e => setVersion(e.target.value)}
          rows="1" 
          placeholder="e.g. 2.2.0-alpha"
        />
      </div>
      <div className="blank"></div>
      <div className="darkRow">Description(Markdown Supported):</div>
      <div className="newCommit">
        <TextareaAutosize
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows="5" 
          placeholder={"e.g. # What is PermaLink?\nA portal page that helps to build *fully* DApp.".
            replace('\\n', '\n')}
        />
      </div>
      
      {isCommitting && <ProgressSpinner />}

      {
        interactionResult !== "" 
        &&
        <div className='center'>
          <div className="darkRow">{interactionResult}</div>
        </div>
      }

      <div className='center'>
        <button 
          className="submitButton"
          disabled={false} 
          onClick={onSubmitButtonClicked}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
