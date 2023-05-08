<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  let board = writable<boolean[][]>(
    new Array(8).fill(new Array(8).fill(false))
  );

  function newBoard() {
    board.update((board) => {
      board = [];
      for (let i = 0; i < 8; ++i) {
        board.push([]);
        for (let j = 0; j < 8; ++j) {
          board[i].push(Math.random() > 0.5);
        }
      }
      return board;
    });
  }

  onMount(newBoard);

  function isHeadsEven(row: boolean[]): boolean {
    let i = 0;
    row.forEach((cell) => {
      if (cell) i++;
    });
    return i % 2 === 0;
  }

  function findSelectedRow(board: boolean[][]): number {
    let next = board;

    while (next.length !== 1) {
      next = isHeadsEven(next.slice(0, next.length / 2).flat())
        ? next.slice(0, next.length / 2)
        : next.slice(next.length / 2);
    }

    return board.indexOf(next[0]);
  }

  function findSelectedColumn(board: boolean[][]): number {
    // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
    const transposed = board[0].map((col, i) => board.map((row) => row[i]));
    let next = transposed;

    while (next.length !== 1) {
      next = isHeadsEven(next.slice(0, next.length / 2).flat())
        ? next.slice(0, next.length / 2)
        : next.slice(next.length / 2);
    }

    return transposed.indexOf(next[0]);
  }

  let selectedRow = 0;
  let selectedColumn = 0;

  board.subscribe((board) => {
    selectedRow = findSelectedRow(board);
    selectedColumn = findSelectedColumn(board);
  });
</script>

<main class="h-screen flex flex-col items-center">
  <h1 class="text-center text-5xl">Coins on a chess board</h1>
  <div class="flex flex-col items-center justify-center h-full w-full">
    <button on:click={newBoard} class="py-2 px-2 rounded bg-slate-100 mb-5"
      >New board</button
    >
    <div class="grid place-content-center w-full">
      <div />
      {#each new Array(8) as _, i}
        <div class="text-center">
          {String.fromCharCode(i + 65)}
        </div>
      {/each}
      <div />

      {#each $board as row, i}
        <div class="text-right flex flex-col justify-center">
          {i + 1}
        </div>
        {#each row as cell, j}
          <button
            class={`aspect-square border font-bold text-xl ${
              (i + j) % 2 === 0 ? 'bg-black text-white' : ''
            } ${
              selectedRow === i || selectedColumn === j
                ? 'bg-yellow-300 !text-black'
                : ''
            }
      ${
        selectedRow === i && selectedColumn === j
          ? '!bg-green-500 !text-white'
          : ''
      }`}
            on:click={() => {
              board.update((board) => {
                board[i][j] = !board[i][j];
                return board;
              });
            }}
          >
            {cell ? 'T' : 'C'}
            <!-- <br />
            {j + 1};{i + 1} -->
          </button>
        {/each}
        <div />
      {/each}
    </div>
  </div>
</main>

<style>
  .grid {
    grid-template-columns: repeat(10, min(5rem, 12%));
  }
</style>
