import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-gear",
    dev: "code",
    trial: "user-gear",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list" :key="i">
                        <td class="rank">
                            <p v-if="i + 1 <= 150" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || 'Error' }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators || []" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'None' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent"><p>{{ record.percent }}%</p></td>
                            <td class="user"><a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a></td>
                            <td class="hz"><p>{{ record.hz }}Hz</p></td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>Select a level to view details</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="'assets/' + roleIconMap[editor.role] + (store.dark ? '-dark' : '') + '.svg'" :alt="editor.role">
                                <!-- Fixed: Links are now clickable again -->
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else class="type-label-lg">{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        roleIconMap,
        store
    }),
    computed: {
        level() {
            return (this.list && this.list[this.selected] && this.list[this.selected][0]) ? this.list[this.selected][0] : null;
        },
        video() {
            if (!this.level || !this.level.verification) return '';
            return embed(this.level.verification);
        },
    },
    async mounted() {
        this.list = await fetchList();
        this.editors = await fetchEditors();
        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
