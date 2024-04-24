<script>
  import L1cache from "./l1cache.js";
  import memory from "./mainMemory.js";

  let mainMemory = new memory(64 * Math.pow(2, 10), 64);
  let l1cache = new L1cache(64 * Math.pow(2, 10), 8 * Math.pow(2, 10), 128, 64);
  console.log(l1cache);
  console.log(mainMemory);
  let mainMemoryEnabled = false;
  let l1cacheEnabled = false;
  let victimCacheEnabled = false;
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
        victimCacheEnabled = false;
      }}>main Memory</button
    >
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        mainMemoryEnabled = false;
        l1cacheEnabled = true;
        victimCacheEnabled = false;
      }}>L1 cache</button
    >
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        mainMemoryEnabled = false;
        l1cacheEnabled = false;
        victimCacheEnabled = true;
        console.log(l1cache.readCache(0, mainMemory));
      }}>victim Cache</button
    >
  </div>

  <div>
    {#if l1cacheEnabled}
      {#each l1cache.cache as line}
        <div class="flex flex-row">
          {#each line as cell}
            {#if cell[0] != null}
              <div class="border m-2 bg-gray-800">{cell[0]}</div>
            {:else}
              <div class="border m-2 bg-gray-800">{0}</div>
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
              <div class="border m-2 bg-gray-800">{cell}</div>
            {:else}
              <div class="border m-2 bg-gray-800">{0}</div>
            {/if}
          {/each}
        </div>
      {/each}
    {/if}
    {#if victimCacheEnabled}
      {#each l1cache.victimCache.cache as line}
        <div class="flex flex-row">
          {#each line as cell}
          {#if cell != null}
          <div class="border m-2 bg-gray-800">{cell}</div>
        {:else}
          <div class="border m-2 bg-gray-800">{0}</div>
        {/if}          
        {/each}
        </div>
      {/each}
    {/if}
  </div>
</div>
