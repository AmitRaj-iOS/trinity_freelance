import { useState } from "react";
import { Plus } from "lucide-react";
import Badge from "../common/Badge";
import { useFilterData } from "../../context/FilterDataContext";

function Section({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 card-shadow">
      <h3 className="text-sm font-bold text-navy-900">{title}</h3>
      {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ChipList({ items }) {
  if (!items.length) return <p className="text-xs text-slate-400">None added yet.</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} variant="soft">
          {item}
        </Badge>
      ))}
    </div>
  );
}

function InlineAddForm({ placeholder, onAdd, buttonLabel = "Add" }) {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onAdd(value);
        setValue("");
      }}
      className="mt-3 flex gap-2"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder={placeholder}
        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      />
      <button
        type="submit"
        className="flex shrink-0 items-center gap-1 rounded-lg bg-navy-900 px-3 py-2 text-xs font-bold text-white hover:bg-navy-800"
      >
        <Plus className="h-3.5 w-3.5" />
        {buttonLabel}
      </button>
    </form>
  );
}

export default function ManageFiltersPanel() {
  const {
    states,
    citiesByState,
    localities,
    propertyTypes,
    bhkOptions,
    budgetRanges,
    addState,
    addCity,
    addLocality,
    addPropertyType,
    addBhkOption,
    addBudgetRange,
  } = useFilterData();

  const [citySelectedState, setCitySelectedState] = useState(states[0] || "");
  const [budgetLabel, setBudgetLabel] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Section title="States" description="Region options shown on the search bar and property form.">
        <ChipList items={states} />
        <InlineAddForm placeholder="e.g. Kerala" onAdd={addState} />
      </Section>

      <Section title="Cities" description="Add a city under an existing state.">
        <select
          value={citySelectedState}
          onChange={(e) => setCitySelectedState(e.target.value)}
          className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          {states.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <ChipList items={citiesByState[citySelectedState] || []} />
        <InlineAddForm
          placeholder="e.g. Salem"
          buttonLabel="Add City"
          onAdd={(city) => addCity(citySelectedState, city)}
        />
      </Section>

      <Section title="Localities / Areas" description="Suggested localities across every city.">
        <ChipList items={localities} />
        <InlineAddForm placeholder="e.g. Anna Nagar" onAdd={addLocality} />
      </Section>

      <Section title="Property Types" description="Types buyers can filter by and owners can list under.">
        <ChipList items={propertyTypes.map((t) => t.label)} />
        <InlineAddForm placeholder="e.g. Farmhouse" onAdd={addPropertyType} />
      </Section>

      <Section title="BHK / Configuration" description="Bedroom configuration options.">
        <ChipList items={bhkOptions.map((n) => `${n} BHK`)} />
        <InlineAddForm
          placeholder="e.g. 6"
          buttonLabel="Add BHK"
          onAdd={(v) => addBhkOption(v.replace(/\D/g, ""))}
        />
      </Section>

      <Section title="Budget Ranges" description="Price bands used for buyer search filters.">
        <div className="space-y-1.5">
          {budgetRanges.map((b) => (
            <div key={b.label} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{b.label}</span>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!budgetLabel.trim()) return;
            addBudgetRange(budgetLabel, budgetMin, budgetMax);
            setBudgetLabel("");
            setBudgetMin("");
            setBudgetMax("");
          }}
          className="mt-3 grid grid-cols-2 gap-2"
        >
          <input
            value={budgetLabel}
            onChange={(e) => setBudgetLabel(e.target.value)}
            type="text"
            placeholder="Label e.g. ₹2 Cr - ₹3 Cr"
            className="col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <input
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value.replace(/\D/g, ""))}
            type="text"
            inputMode="numeric"
            placeholder="Min ₹"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <input
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value.replace(/\D/g, ""))}
            type="text"
            inputMode="numeric"
            placeholder="Max ₹ (optional)"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            className="col-span-2 flex items-center justify-center gap-1 rounded-lg bg-navy-900 px-3 py-2 text-xs font-bold text-white hover:bg-navy-800"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Budget Range
          </button>
        </form>
      </Section>
    </div>
  );
}
