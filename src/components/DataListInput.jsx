import { For } from 'solid-js';

function DataListInput(props) {
  return (
    <>
      <input
        type="text"
        placeholder={props.placeholder}
        list={props.dataListId}
        value={props.value()}
        onInput={props.onInput}
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
      />
      <datalist id={props.dataListId}>
        <For each={props.options()}>
          {(option) => <option value={option} />}
        </For>
      </datalist>
    </>
  );
}

export default DataListInput;