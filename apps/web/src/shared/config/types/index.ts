export type MutationProps<Data> = {
   onSuccess?: (data: Data | null) => void;
   onError?: (error: Error) => void;
};
