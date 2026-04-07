var MusicSearchEngine = {
    // 1. HÀM XỬ LÝ DỮ LIỆU (PHỄU LỌC)
    // data: mảng gốc, config: { keyword, sortBy, limit }
    process: function(data, config = {}) {
        let result = [...data];


        // PHỄU 1: TÌM KIẾM ĐA DẠNG (Keyword)
        if (config.keyword) {
            const key = config.keyword.toLowerCase().trim();
            result = result.filter(item => {
                const title = (item.title || item.name || "").toLowerCase();
                const artist = (item.artist_name || "").toLowerCase();
                const country = (item.country || "").toLowerCase();
                return title.includes(key) || artist.includes(key) || country.includes(key);
            });
        }


        // PHỄU 2: SẮP XẾP ĐA DẠNG (Sort)
        if (config.sortBy === 'hot') {
            // Xếp theo lượt nghe (listens) hoặc lượt xem của Album
            result.sort((a, b) => (b.listens || b.views || 0) - (a.listens || a.views || 0));
        } else if (config.sortBy === 'new') {
            // Xếp theo ngày phát hành hoặc năm
            result.sort((a, b) => {
                const dateA = a.release_date || a.release_year || 0;
                const dateB = b.release_date || b.release_year || 0;
                return new Date(dateB) - new Date(dateA);
            });
        }


        // PHỄU 3: PHÂN PHỐI SỐ LƯỢNG (Limit)
        if (config.limit) {
            result = result.slice(0, config.limit);
        }


        return result;
    },


    // 2. HÀM LẮNG NGHE THANH SEARCH TRÊN NAVBAR
    // callback: Hàm sẽ chạy khi người dùng gõ phím
    initGlobalSearch: function(callback) {
        // Đợi navbar load xong (vì navbar dùng loadComponent)
        const checkExist = setInterval(() => {
            const searchInput = document.querySelector(".search-box input");
            if (searchInput) {
                clearInterval(checkExist);
                searchInput.addEventListener("input", (e) => {
                    callback(e.target.value);
                });
            }
        }, 100);
    }
};
