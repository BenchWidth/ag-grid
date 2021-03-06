import { IAgLabel } from "./agAbstractLabel";
import { RefSelector } from "./componentAnnotations";
import { AgAbstractField } from "./agAbstractField";
import { _ } from "../utils";

export interface IInputField extends IAgLabel {
    value?: any;
    width?: number;
}

export type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export abstract class AgAbstractInputField<T extends FieldElement, K> extends AgAbstractField<K> {
    protected abstract inputType: string;

    protected config: IInputField = {};

    protected TEMPLATE =
        `<div role="presentation">
            <label ref="eLabel" class="ag-input-field-label"></label>
            <div ref="eWrapper" class="ag-wrapper ag-input-wrapper" role="presentation">
                <%displayField% ref="eInput" class="ag-input-field-input"></%displayField%>
            </div>
        </div>`;

    @RefSelector('eLabel') protected eLabel: HTMLLabelElement;
    @RefSelector('eWrapper') protected eWrapper: HTMLElement;
    @RefSelector('eInput') protected eInput: T;

    protected postConstruct() {
        super.postConstruct();
        this.setInputType();
        _.addCssClass(this.eLabel, `${this.className}-label`);
        _.addCssClass(this.eWrapper, `${this.className}-input-wrapper`);
        _.addCssClass(this.eInput, `${this.className}-input`);
        _.addCssClass(this.getGui(), 'ag-input-field');

        const inputId = this.eInput.id ? this.eInput.id : `ag-input-id-${this.getCompId()}`;
        this.eLabel.htmlFor = inputId;
        this.eInput.id = inputId;

        const { width, value } = this.config;

        if (width != null) {
            this.setWidth(width);
        }

        if (value != null) {
            this.setValue(value);
        }

        this.addInputListeners();
    }

    protected addInputListeners() {
        this.addDestroyableEventListener(this.eInput, 'input', (e) => {
            const value = e.target.value;

            this.setValue(value);
        });
    }

    private setInputType() {
        if (this.inputType) {
            this.eInput.setAttribute('type', this.inputType);
        }
    }

    public getInputElement(): FieldElement {
        return this.eInput;
    }

    public setInputWidth(width: number | 'flex'): this {
        _.setElementWidth(this.eWrapper, width);
        return this;
    }

    public setInputName(name: string): this {
        this.getInputElement().setAttribute('name', name);

        return this;
    }

    public getFocusableElement(): HTMLElement {
        return this.eInput;
    }

    public setMaxLength(length: number): this {
        const eInput = this.eInput as HTMLInputElement;
        eInput.maxLength = length;

        return this;
    }

    public setInputPlaceholder(placeholder: string): this {
        const eInput = this.eInput;

        if (placeholder) {
            eInput.setAttribute('placeholder', placeholder);
        } else {
            eInput.removeAttribute('placeholder');
        }

        return this;
    }

    public setDisabled(disabled: boolean): this {
        if (disabled) {
            this.eInput.setAttribute('disabled', 'true');
        } else {
            this.eInput.removeAttribute('disabled');
        }

        return super.setDisabled(disabled);
    }
}