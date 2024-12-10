import { For } from 'solid-js';

function SelectField(props) {
  return (
    <select
      value={props.value()}
      onInput={props.onInput}
      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent cursor-pointer"
    >
      <option value="">{props.label}</option>
      <For each={props.options()}>
        {(option) => <option value={option}>{option}</option>}
      </For>
    </select>
  );
}

export default SelectField;