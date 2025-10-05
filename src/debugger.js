class Debugger
{
    static ENABLED = true;
    static MAX_TIMING_ENTRIES = 100; // Максимальна кількість записів часу виконання
    static Timimgs = []

    static logTime(label, executionTime, context = {}) {
        if (!this.ENABLED) return;
        this.Timimgs.push({ label, "time (ms)": executionTime, ...context });
        if (this.Timimgs.length > this.MAX_TIMING_ENTRIES) {
            this.Timimgs.shift(); // Видаляємо найстаріший запис
        }
    }

    static printTimings(params = {}) {
        if (!this.ENABLED) return;
        // console.table(this.Timimgs, params.fields);
    }
}
