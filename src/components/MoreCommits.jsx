import '../App.css';

import React from 'react';
import { ProgressSpinner } from './ProgressSpinner';
import { useEffect } from 'react';
import { readState, getRelativeTime } from '../lib/api';

export const MoreCommits = (props) => {
  const [commits, setCommits] = React.useState([]);
  const [isCommitting, setIsCommitting] = React.useState(true);
  const [interactionResult, setInteractionResult] = React.useState("");

  useEffect(() => {
    readState().then(ret => {
      setInteractionResult("");
      setIsCommitting(false);
      if (ret.status === false) {
        setInteractionResult(ret.result);
        return;
      } else {
        if (!ret.result || !ret.result.commits) {
          setInteractionResult("No more commits found");
          return;
        }
        setCommits(ret.result.commits);
      }
    });
  }, []);

  function OnRenderTable() {
    console.log('commits: ', commits);
    if (commits.length === 0) {
      return (<></>);
    } 
    return (
      <table>
        <tr>
          <td className='tableTitle'>Version</td>
          <td className='tableTitle'>CommitTime</td>
          <td className='tableTitle'>Description</td>
        </tr>
        {commits.reverse().map(value => 
          <RenderLine
            url = {value.url}
            description = {value.description}
            version = {value.version}
            commitBlockHeight = {value.commitBlockHeight}
          />
        )}
      </table>
    );
  }

  return (
    <>
      {isCommitting && <ProgressSpinner />}

      {
        !isCommitting && interactionResult === ''
        &&
        <div className="darkRow">
          { OnRenderTable() }
        </div>
      }

      {
        interactionResult !== '' && <div className="darkRow"> {interactionResult} </div>
      }
    </>
  );
};

const RenderLine = (props) => {
  const [relativeTime, setRelativeTime] = React.useState();

  useEffect(() => {
    getRelativeTime(props.commitBlockHeight).then(ret => {
      setRelativeTime(ret);
    });
  }, []);

  return (
    <tr>
        <td className='tableCol'> <a href={props.url}> {props.version} </a> </td>
        <td className='tableCol'> <time> {relativeTime} </time> </td>
        <td className='tableCol'> {props.description} </td>
    </tr>
  );
}