<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg mr-3 shadow-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 10h4l3 10 4-18 3 8h4" />
              </svg>
            </div>
            <div>
              <h1 class="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Dealer Portal</h1>
              <p class="text-xs text-gray-500 hidden sm:block">Manage rejected offers</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-gray-900">{{ dealerUser?.name || dealerUser?.email }}</p>
              <p class="text-xs text-gray-500">Dealer</p>
            </div>
            <button 
              @click="handleLogout"
              class="p-2 text-gray-400 hover:text-gray-600 transition-all rounded-lg hover:bg-gray-100"
              title="Logout"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Stats Summary -->
      <div v-if="!isLoading && !error && pagination.total > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p class="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Offers</p>
          <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ pagination.total }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p class="text-xs sm:text-sm font-medium text-gray-500 mb-1">With Status</p>
          <p class="text-xl sm:text-2xl font-bold text-emerald-600">
            {{ offers.filter(o => o.dealerMeta?.internalStatus).length }}
          </p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p class="text-xs sm:text-sm font-medium text-gray-500 mb-1">With Notes</p>
          <p class="text-xl sm:text-2xl font-bold text-blue-600">
            {{ offers.filter(o => o.dealerMeta?.notes?.length > 0).length }}
          </p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p class="text-xs sm:text-sm font-medium text-gray-500 mb-1">New</p>
          <p class="text-xl sm:text-2xl font-bold text-orange-600">
            {{ offers.filter(o => !o.dealerMeta?.internalStatus || o.dealerMeta.internalStatus === 'new').length }}
          </p>
        </div>
      </div>

      <!-- Main Content Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-1">Offers</h2>
              <p class="text-xs sm:text-sm text-gray-600">
                Review offers and manage internal statuses and notes.
              </p>
            </div>
            <button 
              @click="() => loadOffers()" 
              :disabled="isLoading"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v6h6M20 20v-6h-6M5 19l4.5-4.5M19 5l-4.5 4.5" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="flex-1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Filter by Internal Status</label>
              <select
                v-model="statusFilter"
                @change="handleFilterChange"
                class="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="">All Offers</option>
                <option value="none">No Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in_review">In Review</option>
                <option value="offered">Offered</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            <div class="text-sm text-gray-600">
              Showing {{ pagination.page }} of {{ pagination.pages }} pages
              <span class="text-gray-400">({{ pagination.total }} total)</span>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="p-4 sm:p-6">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
            <p class="text-sm text-gray-500">Loading offers...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <h3 class="text-sm font-semibold text-red-800 mb-1">Error loading offers</h3>
                <p class="text-sm text-red-700 mb-3">{{ error }}</p>
                <button 
                  @click="() => loadOffers()" 
                  class="text-sm font-medium text-red-600 hover:text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="offers.length === 0" class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No rejected offers</h3>
            <p class="text-sm text-gray-500 max-w-sm mx-auto">
              There are no rejected offers available at this time. Check back later or refresh the page.
            </p>
          </div>

          <!-- Offers List (rows, with clear separation) -->
          <div v-else class="space-y-4">
            <div
              v-for="item in offers"
              :key="item.response._id"
              class="bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-4 sm:py-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col gap-3"
            >
              <!-- Top row: basic info + quick actions -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <button
                    type="button"
                    class="text-left w-full"
                    @click="openDetails(item.response)"
                  >
                      <p class="text-base font-semibold text-gray-900 truncate">
                      {{ getBusinessName(item.response) }}
                    </p>
                      <p class="text-sm text-gray-500 font-mono">
                      ID: {{ item.response.uniqueId }}
                    </p>
                      <p class="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <span class="truncate">{{ getOwnerName(item.response) || 'Owner unknown' }}</span>
                      <span class="hidden sm:inline text-gray-300">•</span>
                      <span class="hidden sm:inline truncate" v-if="getEmail(item.response)">{{ getEmail(item.response) }}</span>
                    </p>
                  </button>
                </div>
                <div class="flex items-center gap-3 mt-1 sm:mt-0">
                  <p class="text-sm text-gray-500 whitespace-nowrap">
                    Created: {{ formatDate(item.response.createdAt) }}
                  </p>
                </div>
              </div>

              <!-- Middle row: key numbers + dealer status -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div v-if="getRequestedAmount(item.response)">
                  <p class="font-medium text-gray-500 mb-0.5">Requested</p>
                  <p class="text-gray-900 font-semibold">{{ getRequestedAmount(item.response) }}</p>
                </div>
                <div v-if="getMonthlyRevenue(item.response)">
                  <p class="font-medium text-gray-500 mb-0.5">Monthly Revenue</p>
                  <p class="text-gray-900 font-semibold">{{ getMonthlyRevenue(item.response) }}</p>
                </div>
                <div v-if="getLocation(item.response)">
                  <p class="font-medium text-gray-500 mb-0.5">Location</p>
                  <p class="text-gray-900 truncate">{{ getLocation(item.response) }}</p>
                </div>
                <div>
                  <p class="font-medium text-gray-500 mb-1.5">Internal Status</p>
                  <div v-if="item.dealerMeta?.internalStatus" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm shadow-sm" :class="getStatusBadgeClass(item.dealerMeta.internalStatus)">
                    <!-- New Icon -->
                    <svg v-if="item.dealerMeta.internalStatus === 'new'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <!-- Contacted Icon -->
                    <svg v-else-if="item.dealerMeta.internalStatus === 'contacted'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <!-- In Review Icon -->
                    <svg v-else-if="item.dealerMeta.internalStatus === 'in_review'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <!-- Offered Icon -->
                    <svg v-else-if="item.dealerMeta.internalStatus === 'offered'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <!-- Declined Icon -->
                    <svg v-else-if="item.dealerMeta.internalStatus === 'declined'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span class="capitalize">{{ item.dealerMeta.internalStatus.replace('_', ' ') }}</span>
                  </div>
                  <div v-else class="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-600 border border-gray-200 shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Not set</span>
                  </div>
                  <p v-if="item.dealerMeta?.internalStatusUpdatedAt" class="text-xs text-gray-500 mt-1.5">
                    Updated {{ formatDate(item.dealerMeta.internalStatusUpdatedAt) }}
                  </p>
                </div>
              </div>

              <!-- Bottom row: controls + notes -->
              <div class="mt-1 flex flex-col md:flex-row md:items-start md:gap-4">
                <!-- Left: controls -->
                <div class="md:w-1/2 space-y-2">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Internal Status</label>
                    <div class="relative">
                      <select
                        v-model="item.localInternalStatus"
                        @change="handleStatusChange(item)"
                        :disabled="item.isSaving"
                        class="w-full px-3 py-2.5 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white appearance-none cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="item.localInternalStatus ? getStatusBadgeClass(item.localInternalStatus) : 'text-gray-700'"
                      >
                        <option value="">Not set</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_review">In Review</option>
                        <option value="offered">Offered</option>
                        <option value="declined">Declined</option>
                      </select>
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div v-if="item.localInternalStatus" class="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded text-xs" :class="getStatusBadgeClass(item.localInternalStatus)">
                      <svg v-if="item.isSaving" class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span class="capitalize font-medium">{{ item.localInternalStatus.replace('_', ' ') }}</span>
                      <span v-if="item.isSaving" class="text-xs opacity-75">(saving...)</span>
                      <span v-else-if="item.saveMessage" class="text-xs opacity-75">(saved)</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">
                      Add Note
                      <span class="text-xs font-normal text-gray-500 ml-2">(Ctrl+Enter to save)</span>
                    </label>
                    <textarea
                      v-model="item.newNote"
                      @keydown.ctrl.enter="saveDealerMeta(item)"
                      rows="2"
                      class="w-full px-3 py-2 text-base border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="Add internal note..."
                    ></textarea>
                  </div>
                  <div class="flex items-center justify-between gap-3">
                    <button
                      @click="saveDealerMeta(item)"
                      :disabled="item.isSaving || !item.newNote?.trim()"
                      class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        v-if="item.isSaving"
                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>{{ item.isSaving ? 'Saving...' : 'Save Changes' }}</span>
                    </button>
                    <div class="flex items-center gap-2">
                      <span v-if="item.saveMessage" class="text-sm text-emerald-600">{{ item.saveMessage }}</span>
                      <button
                        type="button"
                        @click="openDetails(item.response)"
                        class="text-xs text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                      >
                        <span>View details</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Right: brief notes summary + modal trigger -->
                <div class="mt-3 md:mt-0 md:flex-1" v-if="item.dealerMeta?.notes?.length">
                  <p class="text-sm font-semibold text-gray-700 mb-1.5">
                    Notes ({{ item.dealerMeta.notes.length }})
                  </p>
                  <div class="border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
                    <p class="text-xs text-gray-500 mb-1">Last note</p>
                    <p class="text-sm text-gray-900 mb-1 truncate">
                      {{ getLastNote(item.dealerMeta)?.text }}
                    </p>
                    <p class="text-xs text-gray-500 flex justify-between gap-2">
                      <span>{{ formatDate(getLastNote(item.dealerMeta)?.createdAt) }}</span>
                      <span v-if="getLastNote(item.dealerMeta)?.createdByEmail" class="truncate">
                        {{ getLastNote(item.dealerMeta)?.createdByName || getLastNote(item.dealerMeta)?.createdByEmail }}
                      </span>
                    </p>
                    <button
                      type="button"
                      class="mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                      @click="openNotesModal(item)"
                    >
                      <span>View all notes</span>
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination Controls -->
          <div v-if="!isLoading && !error && offers.length > 0" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div class="text-sm text-gray-600">
              Showing {{ ((pagination.page - 1) * pagination.limit) + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} offers
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="goToPage(pagination.page - 1)"
                :disabled="pagination.page === 1 || isLoading"
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div class="flex items-center gap-1">
                <template v-for="pageNum in getPageNumbers()" :key="pageNum">
                  <button
                    v-if="typeof pageNum === 'number'"
                    @click="goToPage(pageNum)"
                    :disabled="isLoading"
                    :class="[
                      'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      pageNum === pagination.page
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    ]"
                  >
                    {{ pageNum }}
                  </button>
                  <span v-else class="px-2 text-gray-500">{{ pageNum }}</span>
                </template>
              </div>
              <button
                @click="goToPage(pagination.page + 1)"
                :disabled="pagination.page === pagination.pages || isLoading"
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Full details modal (read-only like admin) -->
    <ResponseModal
      v-if="selectedResponse"
      :isOpen="isModalOpen"
      :response="selectedResponse"
      @close="closeDetails"
      @statusUpdated="handleStatusUpdated"
    />

    <!-- Notes history modal -->
    <div v-if="isNotesModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black bg-opacity-40" @click="closeNotesModal"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">
              Notes for {{ notesModalItemBusinessName }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-500" v-if="notesModalItemId">
              ID: {{ notesModalItemId }}
            </p>
          </div>
          <button
            type="button"
            class="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            @click="closeNotesModal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-5 py-4 overflow-y-auto space-y-3">
          <div
            v-for="note in notesModalNotes"
            :key="note._id || note.createdAt"
            class="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
          >
            <p class="text-sm text-gray-900 mb-1">
              {{ note.text }}
            </p>
            <p class="text-xs text-gray-500 flex justify-between gap-2">
              <span>{{ formatDate(note.createdAt) }}</span>
              <span v-if="note.createdByEmail" class="truncate">
                {{ note.createdByName || note.createdByEmail }}
              </span>
            </p>
          </div>
          <p v-if="!notesModalNotes.length" class="text-sm text-gray-500 text-center">
            No notes available.
          </p>
        </div>
        <div class="px-5 py-3 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            @click="closeNotesModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { config } from '../config';
import { useDealerAuth } from '../composables/useDealerAuth';
import ResponseModal from '../components/ResponseModal.vue';

const router = useRouter();
const { user, logout, verifyToken } = useDealerAuth();

const dealerUser = computed(() => user.value);
const offers = ref<any[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const statusFilter = ref('');
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
});

const isModalOpen = ref(false);
const selectedResponse = ref<any | null>(null);

const isNotesModalOpen = ref(false);
const notesModalItem = ref<any | null>(null);

const loadOffers = async (page?: number) => {
  try {
    isLoading.value = true;
    error.value = null;
    
    if (page !== undefined) {
      pagination.value.page = page;
    }
    
    const params: any = {
      page: pagination.value.page,
      limit: pagination.value.limit
    };
    
    if (statusFilter.value) {
      params.internalStatus = statusFilter.value;
    }
    
    const response = await axios.get(`${config.apiUrl}/dealer/offers/rejected`, { params });
    const data = response.data.data || [];

    offers.value = data.map((item: any) => ({
      ...item,
      localInternalStatus: item.dealerMeta?.internalStatus || '',
      originalInternalStatus: item.dealerMeta?.internalStatus || '', // Track original to detect changes
      newNote: '',
      isSaving: false,
      saveMessage: ''
    }));
    
    // Update pagination from response
    if (response.data.pagination) {
      pagination.value = {
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      };
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load rejected offers';
    console.error('Dealer loadOffers error:', err);
  } finally {
    isLoading.value = false;
  }
};

const handleFilterChange = () => {
  pagination.value.page = 1; // Reset to first page when filter changes
  loadOffers();
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.pages) {
    loadOffers(page);
  }
};

const getPageNumbers = () => {
  const pages = pagination.value.pages;
  const current = pagination.value.page;
  const delta = 2; // Show 2 pages on each side
  const range = [];
  const rangeWithDots = [];

  for (let i = Math.max(2, current - delta); i <= Math.min(pages - 1, current + delta); i++) {
    range.push(i);
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (current + delta < pages - 1) {
    rangeWithDots.push('...', pages);
  } else if (pages > 1) {
    rangeWithDots.push(pages);
  }

  return rangeWithDots.filter((v, i, a) => a.indexOf(v) === i);
};

const handleStatusChange = async (item: any) => {
  // Only auto-save if status actually changed
  if (item.localInternalStatus !== item.originalInternalStatus) {
    await saveDealerMeta(item, true); // true = status-only save
  }
};

const saveDealerMeta = async (item: any, statusOnly: boolean = false) => {
  try {
    item.isSaving = true;
    item.saveMessage = '';

    const payload: any = {};
    if (item.localInternalStatus) {
      payload.internalStatus = item.localInternalStatus;
    }
    if (!statusOnly && item.newNote?.trim()) {
      payload.note = item.newNote.trim();
    }

    // Only save if there's something to save
    if (Object.keys(payload).length === 0) {
      item.isSaving = false;
      return;
    }

    // Save in background without showing loading
    const response = await axios.post(`${config.apiUrl}/dealer/offers/${item.response._id}/notes`, payload);

    // Update local state with the response data (background update)
    if (response.data.success && response.data.data) {
      const updatedDealerOffer = response.data.data;
      
      // Update the item's dealerMeta locally without reloading everything
      if (!item.dealerMeta) {
        item.dealerMeta = {};
      }
      
      item.dealerMeta.id = updatedDealerOffer._id;
      item.dealerMeta.internalStatus = updatedDealerOffer.internalStatus;
      item.dealerMeta.notes = updatedDealerOffer.notes || [];
      
      // Update status update info if present
      if (updatedDealerOffer.internalStatusUpdatedAt) {
        item.dealerMeta.internalStatusUpdatedAt = updatedDealerOffer.internalStatusUpdatedAt;
        item.dealerMeta.internalStatusUpdatedBy = updatedDealerOffer.internalStatusUpdatedBy;
        item.dealerMeta.internalStatusUpdatedByEmail = updatedDealerOffer.internalStatusUpdatedByEmail;
        item.dealerMeta.internalStatusUpdatedByName = updatedDealerOffer.internalStatusUpdatedByName;
      }
      
      // Update local status to match
      item.localInternalStatus = updatedDealerOffer.internalStatus || '';
      // Update original status to track future changes
      item.originalInternalStatus = updatedDealerOffer.internalStatus || '';
    }

    item.saveMessage = statusOnly ? 'Status saved' : 'Saved';
    // Clear note input after successful save (only if note was saved)
    if (payload.note) {
      item.newNote = '';
    }
    
    // Clear save message after 2 seconds
    setTimeout(() => {
      item.saveMessage = '';
    }, 2000);
  } catch (err: any) {
    console.error('Dealer saveDealerMeta error:', err);
    item.saveMessage = err.response?.data?.message || 'Failed to save';
  } finally {
    item.isSaving = false;
  }
};

const openDetails = (response: any) => {
  selectedResponse.value = response;
  isModalOpen.value = true;
};

const closeDetails = () => {
  isModalOpen.value = false;
  selectedResponse.value = null;
};

// Keep local list in sync if status somehow changes (e.g. admin action elsewhere)
const handleStatusUpdated = (updated: any) => {
  const idx = offers.value.findIndex(o => o.response._id === updated._id);
  if (idx !== -1) {
    offers.value[idx].response = updated;
  }
};

const handleLogout = () => {
  logout();
  router.push('/dealer/login');
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getBusinessName = (response: any) => {
  return response.formData?.legalBusinessName ||
    response.formData?.businessInfo?.businessName ||
    response.mcaId?.company ||
    response.mcaId?.businessName ||
    'Business Application';
};

const getOwnerName = (response: any) => {
  const formData = response.formData;
  const userContact = response.userContact;
  const mcaId = response.mcaId;

  if (formData?.firstName && formData?.lastName) {
    return `${formData.firstName} ${formData.lastName}`;
  }
  if (formData?.ownerInfo?.firstName && formData?.ownerInfo?.lastName) {
    return `${formData.ownerInfo.firstName} ${formData.ownerInfo.lastName}`;
  }
  if (userContact?.name) {
    return userContact.name;
  }
  if (mcaId?.firstName && mcaId?.lastName) {
    return `${mcaId.firstName} ${mcaId.lastName}`;
  }
  return '';
};

const getEmail = (response: any) => {
  return response.formData?.ownerEmail ||
    response.formData?.businessEmail ||
    response.formData?.ownerInfo?.email ||
    response.userContact?.email ||
    response.mcaId?.email ||
    '';
};

const getRequestedAmount = (response: any) => {
  const amount = response.formData?.amountRequested ||
    response.formData?.businessFunding?.requestedAmount ||
    response.mcaId?.amount;

  if (!amount) return '';

  if (typeof amount === 'string' && amount.includes(',')) {
    return `$${amount}`;
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
  return isNaN(numAmount) ? '' : `$${numAmount.toLocaleString()}`;
};

const getLocation = (response: any) => {
  const fd = response.formData || {};
  const city = fd.city || fd.businessCity || fd.ownerCity || response.mcaId?.city;
  const state = fd.state || fd.businessState || fd.ownerState || response.mcaId?.state;
  if (!city && !state) return '';
  if (city && state) return `${city}, ${state}`;
  return city || state || '';
};

const getMonthlyRevenue = (response: any) => {
  const fd = response.formData || {};
  const revenue = fd.monthlyRevenue || fd.businessInfo?.monthlyRevenue || response.mcaId?.monthlyRevenue;
  if (!revenue) return '';
  if (typeof revenue === 'string' && revenue.includes(',')) {
    return `$${revenue}`;
  }
  const num = typeof revenue === 'string' ? parseFloat(revenue.replace(/,/g, '')) : revenue;
  return isNaN(num) ? '' : `$${num.toLocaleString()}`;
};

const getLastNote = (dealerMeta: any) => {
  if (!dealerMeta?.notes || !dealerMeta.notes.length) return null;
  return dealerMeta.notes[dealerMeta.notes.length - 1];
};

const getStatusBadgeClass = (status: string) => {
  const statusMap: Record<string, string> = {
    'new': 'bg-blue-50 text-blue-700 border-2 border-blue-300 shadow-sm',
    'contacted': 'bg-purple-50 text-purple-700 border-2 border-purple-300 shadow-sm',
    'in_review': 'bg-yellow-50 text-yellow-700 border-2 border-yellow-300 shadow-sm',
    'offered': 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300 shadow-sm',
    'declined': 'bg-red-50 text-red-700 border-2 border-red-300 shadow-sm'
  };
  return statusMap[status] || 'bg-gray-50 text-gray-700 border-2 border-gray-300 shadow-sm';
};


const openNotesModal = (item: any) => {
  notesModalItem.value = item;
  isNotesModalOpen.value = true;
};

const closeNotesModal = () => {
  isNotesModalOpen.value = false;
  notesModalItem.value = null;
};

const notesModalNotes = computed(() => notesModalItem.value?.dealerMeta?.notes || []);
const notesModalItemBusinessName = computed(() =>
  notesModalItem.value ? getBusinessName(notesModalItem.value.response) : ''
);
const notesModalItemId = computed(() =>
  notesModalItem.value ? notesModalItem.value.response?.uniqueId : ''
);

onMounted(async () => {
  // Ensure dealer token is valid; if not, redirect to login
  const isValid = await verifyToken();
  if (!isValid) {
    router.push('/dealer/login');
    return;
  }

  await loadOffers();
});
</script>


