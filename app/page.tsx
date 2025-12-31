export default function page() {
  return (
    <div className="min-h-screen overflow-hidden bg-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Top Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border border-gray-200/20 dark:border-white/20">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Smarter Code, Less Effort</span>
            <span className="text-lg">📈</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white">
            Supercharge Your Codebase with an{' '}
            <span className="bg-linear-to-r from-blue-400 to-purple-400 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              AI Coding Agent
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your AI pair programmer write, debug, and refactor code faster with a fully integrated development agent.
          </p>
        </div>

        {/* Code Editor Section */}
        <div className="relative z-10 w-full max-w-7xl mx-auto mt-20">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full h-40 bg-linear-to-b from-blue-500/20 dark:from-blue-500/30 via-blue-500/10 dark:via-blue-500/20 to-transparent blur-3xl"></div>

            {/* Editor Container */}
            <div className="relative bg-gray-100 dark:bg-[#1e1e1e] rounded-lg overflow-hidden shadow-2xl border border-gray-300 dark:border-gray-800">
              {/* Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-200 dark:bg-[#2d2d2d] border-b border-gray-300 dark:border-gray-800">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400">https://vscode.dev</div>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex">
                {/* Sidebar */}
                <div className="w-16 bg-gray-50 dark:bg-[#181818] border-r border-gray-300 dark:border-gray-800 flex flex-col items-center py-4 gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center justify-center cursor-pointer">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center justify-center cursor-pointer">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 flex items-center justify-center cursor-pointer">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                {/* File Explorer */}
                <div className="w-64 bg-gray-100 dark:bg-[#252526] border-r border-gray-300 dark:border-gray-800">
                  <div className="p-2 text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">Explorer</div>
                  <div className="px-2 py-1 space-y-1">
                    <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span>github</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span>images</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span>src</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-sm bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded cursor-pointer border-l-2 border-blue-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>index.html</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>style.css</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>script.js</span>
                    </div>
                  </div>
                </div>

                {/* Code Panels */}
                <div className="flex-1 flex">
                  {/* HTML Panel */}
                  <div className="flex-1 bg-white dark:bg-[#1e1e1e]">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#2d2d2d] border-b border-gray-300 dark:border-gray-800">
                      <span className="text-xs text-gray-600 dark:text-gray-400">index.html</span>
                      <span className="text-xs text-gray-400 dark:text-gray-600">×</span>
                    </div>
                    <div className="p-4 font-mono text-sm">
                      <div className="text-gray-500">&lt;<span className="text-blue-400">html</span>&gt;</div>
                      <div className="text-gray-500 ml-4">&lt;<span className="text-blue-400">head</span>&gt;</div>
                      <div className="text-gray-500 ml-8">&lt;<span className="text-blue-400">title</span>&gt;<span className="text-yellow-300">The Get Started Guide</span>&lt;/<span className="text-blue-400">title</span>&gt;</div>
                      <div className="text-gray-500 ml-8">&lt;<span className="text-blue-400">link</span> <span className="text-green-400">rel</span>=<span className="text-orange-400">&quot;stylesheet&quot;</span> <span className="text-green-400">href</span>=<span className="text-orange-400">&quot;style.css&quot;</span> /&gt;</div>
                      <div className="text-gray-500 ml-8">&lt;<span className="text-blue-400">script</span> <span className="text-green-400">src</span>=<span className="text-orange-400">&quot;script.js&quot;</span>&gt;&lt;/<span className="text-blue-400">script</span>&gt;</div>
                      <div className="text-gray-500 ml-4">&lt;/<span className="text-blue-400">head</span>&gt;</div>
                      <div className="text-gray-500 ml-4">&lt;<span className="text-blue-400">body</span>&gt;</div>
                      <div className="text-gray-500 ml-8">&lt;<span className="text-blue-400">div</span> <span className="text-green-400">class</span>=<span className="text-orange-400">&quot;container&quot;</span>&gt;</div>
                      <div className="text-gray-500 ml-12">&lt;<span className="text-blue-400">div</span> <span className="text-green-400">class</span>=<span className="text-orange-400">&quot;header&quot;</span>&gt;&lt;/<span className="text-blue-400">div</span>&gt;</div>
                      <div className="text-gray-500 ml-12">&lt;<span className="text-blue-400">div</span> <span className="text-green-400">class</span>=<span className="text-orange-400">&quot;main&quot;</span>&gt;&lt;/<span className="text-blue-400">div</span>&gt;</div>
                      <div className="text-gray-500 ml-8">&lt;/<span className="text-blue-400">div</span>&gt;</div>
                    </div>
                  </div>

                  {/* CSS Panel */}
                  <div className="flex-1 bg-white dark:bg-[#1e1e1e] border-l border-gray-300 dark:border-gray-800">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#2d2d2d] border-b border-gray-300 dark:border-gray-800">
                      <span className="text-xs text-gray-600 dark:text-gray-400">style.css</span>
                      <span className="text-xs text-gray-400 dark:text-gray-600">×</span>
                    </div>
                    <div className="p-4 font-mono text-sm">
                      <div className="text-gray-600">{'/* Example CSS */'}</div>
                      <div className="text-purple-400 mt-2">body</div>
                      <div className="text-gray-300 ml-4">{'{'}</div>
                      <div className="text-gray-300 ml-8"><span className="text-green-400">font-family</span>: <span className="text-orange-400">&apos;Arial&apos;</span>, <span className="text-orange-400">sans-serif</span>;</div>
                      <div className="text-gray-300 ml-8"><span className="text-green-400">margin</span>: <span className="text-yellow-300">0</span>;</div>
                      <div className="text-gray-300 ml-8"><span className="text-green-400">padding</span>: <span className="text-yellow-300">0</span>;</div>
                      <div className="text-gray-300 ml-4">{'}'}</div>
                      <div className="text-purple-400 mt-2">button</div>
                      <div className="text-gray-300 ml-4">{'{'}</div>
                      <div className="text-gray-300 ml-8"><span className="text-green-400">background-color</span>: <span className="text-orange-400">#007bff</span>;</div>
                      <div className="text-gray-300 ml-8"><span className="text-green-400">border-radius</span>: <span className="text-yellow-300">4px</span>;</div>
                      <div className="text-gray-300 ml-4">{'}'}</div>
                    </div>
                  </div>

                  {/* JavaScript Panel */}
                  <div className="flex-1 bg-white dark:bg-[#1e1e1e] border-l border-gray-300 dark:border-gray-800">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#2d2d2d] border-b border-gray-300 dark:border-gray-800">
                      <span className="text-xs text-gray-600 dark:text-gray-400">main.js</span>
                      <span className="text-xs text-gray-400 dark:text-gray-600">×</span>
                    </div>
                    <div className="p-4 font-mono text-sm">
                      <div className="text-purple-400">function</div>
                      <div className="text-yellow-300 ml-4">toggleNav</div>
                      <div className="text-gray-300">() {'{'}</div>
                      <div className="text-gray-600 ml-4">{'// Handle navigation toggle'}</div>
                      <div className="text-gray-300 ml-4"><span className="text-purple-400">const</span> <span className="text-blue-400">nav</span> = <span className="text-yellow-300">document</span>.<span className="text-blue-400">getElementById</span>(<span className="text-orange-400">&apos;nav&apos;</span>);</div>
                      <div className="text-gray-600 ml-4">{'// Add event listener'}</div>
                      <div className="text-gray-300 ml-4"><span className="text-yellow-300">console</span>.<span className="text-blue-400">log</span>(<span className="text-orange-400">&apos;Navigation toggled&apos;</span>);</div>
                      <div className="text-gray-300">{'}'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
