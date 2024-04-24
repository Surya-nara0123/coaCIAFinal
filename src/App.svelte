<script>
  import L1cache from "./l1cache.js";
  import L2Cache from "./l2cache.js";
  import memory from "./mainMemory.js";

  let mainMemory = new memory(64 * Math.pow(2, 10), 64);
  let l1cache = new L1cache(64 * Math.pow(2, 10), 8 * Math.pow(2, 10), 128, 64);
  let l2cache = new L2Cache(64 * Math.pow(2, 10), 16 * Math.pow(2, 10), 256, 64, 4);
  console.log(l1cache);
  console.log(mainMemory);
  let mainMemoryEnabled = false;
  let l1cacheEnabled = false;
  let victimCacheEnabled = false;
  let l2CacheEnabled = false
  let numberOfLines = 64;
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
        l2CacheEnabled = false;
        victimCacheEnabled = false;
        numberOfLines = mainMemory.memory.length;
      }}>main Memory</button
    >
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        mainMemoryEnabled = false;
        l1cacheEnabled = true;
        l2CacheEnabled = false;
        victimCacheEnabled = false;
        numberOfLines = l1cache.cache.length;
      }}>L1 cache</button
    >
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        mainMemoryEnabled = false;
        l1cacheEnabled = false;
        l2CacheEnabled = false;
        victimCacheEnabled = true;
        console.log(l1cache.readCache(0, mainMemory));
        numberOfLines = l1cache.victimCache.cache.length;
      }}>victim Cache</button
    >
    <button
      class="m-2 w-[100px]"
      on:click={() => {
        mainMemoryEnabled = false;
        l1cacheEnabled = false;
        l2CacheEnabled = true;
        victimCacheEnabled = false;
        numberOfLines = l2cache.cache.length;
      }}>victim Cache</button
    >
  </div>
  <div
    class="overflow-auto m-2 w-4/5 h-4/5 bg-gray-900 rounded-md flex flex-row relative"
  >
    
    <div
      class="w-full h-full bg-gray-900 rounded-md grid grid-cols-64 overflow-style-none absolute top-[50px] left-[48px] rounded-tl-none"
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
        {#if l1cacheEnabled}
          {#each l2cache.cache as line}
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
        {#if victimCacheEnabled}
          {#each l1cache.victimCache.cache as line}
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
    <div class="bg-gray-900 h-[{numberOfLines == 1024?'8000%':'500%'}] flex flex-col p-1 border-r-2 w-[50px] sticky left-0 pt-[50px]">
      {#each { length: numberOfLines } as _, i}
        <div
          class="m-1 bg-gray-800 p-1 w-[30px] h-[30px] flex items-center justify-center"
        >
          {i}
        </div>
      {/each}
    </div>
    <div class="bg-gray-900 w- full flex flex-row p-1 border-b-2 h-[50px] sticky top-0">
      {#each { length: 64 } as _, i}
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
