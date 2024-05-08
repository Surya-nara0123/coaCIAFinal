<script>
  import L1cache from "./l1cache.js";
  import memory from "./mainMemory.js";

  let mainMemory = new memory(32 * 32 * 2, 32);
  let l1cache = new L1cache(64 * 32, 32 * 64, 64, 32);
  let mainMemoryEnabled = false;
  let l1cacheEnabled = false;
  let matrix1Enabled = false;
  let matrix2Enabled = false;
  let matrixEnabled = false;
  let numberOfLines = 32;
  let address;
  console.log();
  l1cache = l1cache;
  let i1 = 0;
  let j1 = -1;
  let i2 = -1;
  let j2 = 0;
  let matrix1 = new Array(32).fill(null).map(() => new Array(32).fill(null));
  console.log(matrix1);
  let matrix2 = new Array(32).fill(null).map(() => new Array(32).fill(null));
  console.log(matrix2);

  let finalMatrix = new Array(32).fill(null).map(() => new Array(32).fill(null));
  function matrixMultiplication() {
    finalMatrix = new Array(32).fill(null).map(() => new Array(32).fill(null));
    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 32; j++) {
        for (let k = 0; k < 32; k++) {
          finalMatrix[i][j] += matrix1[i][k] * matrix2[k][j];
        }
      }
    }
  }

  function matrixNextItemCalculation() {
    if (j1 < 31) {
      j1++;
      address = i1 * 32 + j1;
      let data = l1cache.readCache(address, mainMemory).data;
      console.log(data, i1, j1, address);
      matrix1[i1][j1] = data;
    } else {
      j1 = -1;
      i1++;
    }

    if (i2 < 31) {
      i2++;
      address = 1024 + i2 * 32 + j2;
      matrix2[i2][j2] = l1cache.readCache(address, mainMemory).data;
    } else {
      i2 = -1;
      j2++;
      matrixMultiplication();
    }
  }

  function matrixNextRowCalculation() {
    while (j1 < 31) {
      if (j1 < 31) {
        j1++;
        address = i1 * 32 + j1;
        matrix1[i1][j1] = l1cache.readCache(address, mainMemory).data;
      } else {
        j1 = -1;
        i1++;
      }
    }
    j1 = -1;
    i1++;

    while (i2 < 31) {
      if (i2 < 31) {
        i2++;
        address = 1024 + i2 * 32 + j2;
        matrix2[i2][j2] = l1cache.readCache(address, mainMemory).data;
      } else {
        i2 = -1;
        j2++;
      }
    }
    i2 = -1;
    j2++;
    matrixMultiplication();
  }
  mainMemory = mainMemory;
</script>

<div class="w-screen h-screen flex flex-col items-center">
  <div
    class="flex flex-row h-1/6 items-center justify-center m-3 mx-5 w-full bg-gray-600 rounded-lg"
  >
    <div class="text-center text-2xl font-bold">Cache Simulator</div>
  </div>

  <div class="flex flex-row items-center justify-center">
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        mainMemoryEnabled = true;
        l1cacheEnabled = false;
        numberOfLines = mainMemory.memory.length;
        matrix1Enabled = false;
        matrix2Enabled = false;
        matrixEnabled = false;
      }}>main Memory</button
    >
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        mainMemoryEnabled = false;
        l1cacheEnabled = true;
        numberOfLines = l1cache.cache.length;
        matrix1Enabled = false;
        matrix2Enabled = false;
        matrixEnabled = false;
      }}>L1 cache</button
    >
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        mainMemoryEnabled = false;
        l1cacheEnabled = false;
        matrix1Enabled = true;
        matrix2Enabled = false;
        matrixEnabled = false;
      }}>Matrix1</button
    >
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        mainMemoryEnabled = false;
        l1cacheEnabled = false;
        matrix1Enabled = false;
        matrix2Enabled = true;
        matrixEnabled = false;
      }}>Matrix2</button
    >
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        mainMemoryEnabled = false;
        l1cacheEnabled = false;
        matrix1Enabled = false;
        matrix2Enabled = false;
        matrixEnabled = true;
      }}>Final Matrix</button
    >
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        matrixNextItemCalculation();
      }}>read element</button
    >
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        matrixNextRowCalculation();
      }}>read Row</button
    >
  </div>
  <div
    class="overflow-auto m-2 w-4/5 h-4/5 bg-gray-900 rounded-md flex flex-row relative"
  >
    <div
      class="w-full h-full bg-gray-900 rounded-md grid grid-cols-32 overflow-style-none absolute top-[50px] left-[48px] rounded-tl-none"
    >
      <div class="m-1 bg-gray-900 rounded-md">
        {#if l1cacheEnabled}
          {#each l1cache.cache as line}
            <div class="flex flex-row">
              {#each line as cell}
                {#if cell[0] != null}
                  <div
                    class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {cell[0]}
                  </div>
                {:else}
                  <div
                    class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {0}
                  </div>
                {/if}
              {/each}
            </div>
          {/each}
        {/if}
        {#if matrixEnabled}
          {#each finalMatrix as line}
            <div class="flex flex-row">
              {#each line as cell}
                {#if cell != null}
                  <div
                    class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {cell}
                  </div>
                {:else}
                  <div
                    class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {0}
                  </div>
                {/if}
              {/each}
            </div>
          {/each}
        {/if}
        {#if matrix1Enabled}
          {#each matrix1 as line}
            <div class="flex flex-row">
              {#each line as cell}
                {#if cell != null}
                  <div
                    class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {cell}
                  </div>
                {:else}
                  <div
                    class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {0}
                  </div>
                {/if}
              {/each}
            </div>
          {/each}
        {/if}
        {#if matrix2Enabled}
          {#each matrix2 as line}
            <div class="flex flex-row">
              {#each line as cell}
                {#if cell != null}
                  <div
                    class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {cell}
                  </div>
                {:else}
                  <div
                    class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {0}
                  </div>
                {/if}
              {/each}
            </div>
          {/each}
        {/if}
        {#if mainMemoryEnabled}
          {#each mainMemory.memory as line}
            <div class="flex flex-row">
              {#each line as cell}
                {#if cell != null}
                  <div
                    class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {cell}
                  </div>
                {:else}
                  <div
                    class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {0}
                  </div>
                {/if}
              {/each}
            </div>
          {/each}
        {/if}
      </div>
    </div>
    <div
      class="bg-gray-900 h-['500%'] flex flex-col p-1 border-r-2 w-[50px] sticky left-0 pt-[50px]"
    >
      {#each { length: numberOfLines } as _, i}
        <div
          class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
        >
          {i}
        </div>
      {/each}
    </div>
    <div
      class="bg-gray-900 w- full flex flex-row p-1 border-b-2 h-[50px] sticky top-0"
    >
      {#each { length: 32 } as _, i}
        <div
          class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
        >
          {i}
        </div>
      {/each}
    </div>
    <div
      class="m-1 bg-gray-800 p-1 w-[48.5px] h-[50px] flex items-center justify-center fixed top-[218px] left-[149px] rounded-tl-md rounded-br-sm"
    >
      .
    </div>
  </div>
</div>
