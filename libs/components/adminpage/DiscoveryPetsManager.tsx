import { useTranslation } from "react-i18next";
import { useRef, useState, ChangeEvent } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Drawer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ExploreIcon from "@mui/icons-material/Explore";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_DISCOVERY_PETS } from "@/apollo/user/query";
import {
  CREATE_DISCOVERY_PET,
  REMOVE_DISCOVERY_PET_BY_ADMIN,
  UPDATE_DISCOVERY_PET_BY_ADMIN,
} from "@/apollo/admin/mutation";
import { IMAGES_UPLOADER } from "@/apollo/user/mutation";
import { DiscoveryPet } from "@/libs/types/discovery-pet/discovery-pet";
import { DiscoveryPetsInquiry } from "@/libs/types/discovery-pet/discovery-pet.input";
import { PetCategory, PetStatus } from "@/libs/enums/discoveryPet.enum";
import { Direction } from "@/libs/enums/common.enum";
import {
  sweetBottomSmallSuccessAlert,
  sweetMixinErrorAlert,
} from "@/libs/sweetAlert";
import {
  BLANK_IMAGE,
  imageUrl,
  isNoDataError,
  metaTotal,
  statusChipClass,
  useDebouncedValue,
} from "./adminHelpers";

const PETS_PER_PAGE = 10;
const CATEGORIES = Object.values(PetCategory);

const STAT_FIELDS = [
  { key: "petDifficulty", labelKey: "discovery.difficulty", letter: "D" },
  { key: "petFerocious", labelKey: "discovery.ferocious", letter: "F" },
  { key: "petSpace", labelKey: "discovery.space", letter: "S" },
  { key: "petGroups", labelKey: "discovery.groups", letter: "G" },
] as const;

const petImageSrc = (path?: string) =>
  path?.startsWith("/") ? path : imageUrl(path);

interface FormShape {
  petCategory: PetCategory;
  petName: string;
  petCountry: string;
  petDifficulty: number;
  petFerocious: number;
  petSpace: number;
  petGroups: number;
  petDescription: string;
  petLink: string;
}

const emptyForm: FormShape = {
  petCategory: PetCategory.DOG,
  petName: "",
  petCountry: "",
  petDifficulty: 50,
  petFerocious: 50,
  petSpace: 50,
  petGroups: 50,
  petDescription: "",
  petLink: "",
};

interface ImageSlot {
  path?: string;
  file?: File;
  preview: string;
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Stack className="admin-dsc-section">
    <Stack className="admin-dsc-section-header">
      <Typography className="admin-dsc-section-title">{title}</Typography>
    </Stack>
    <Stack className="admin-dsc-section-body">{children}</Stack>
  </Stack>
);

const MiniStatBars = ({ pet }: { pet: DiscoveryPet }) => {
  const { t } = useTranslation();
  return (
    <Stack className="admin-dsc-mini-stats">
      {STAT_FIELDS.map((stat) => (
        <Stack
          key={stat.key}
          direction="row"
          alignItems="center"
          gap={0.5}
          title={t(stat.labelKey)}
        >
          <span className="admin-dsc-mini-stat-letter">{stat.letter}</span>
          <span className="admin-dsc-mini-stat-track">
            <span
              className="admin-dsc-mini-stat-fill"
              style={{ width: `${pet[stat.key]}%` }}
            />
          </span>
        </Stack>
      ))}
    </Stack>
  );
};

const DiscoveryCardPreview = ({
  form,
  imageSrc,
  likes,
}: {
  form: FormShape;
  imageSrc: string;
  likes: number;
}) => {
  const { t } = useTranslation();

  return (
    <Stack className="discovery-card admin-dsc-preview-card">
      <Box className="like-icon">
        <Box component="span" className="like-toggle">
          <FavoriteBorderRoundedIcon className="unliked" />
        </Box>
        <Box className="like-count">{likes}</Box>
      </Box>

      <Box className="pet-image-box">
        <img
          className="pet-image"
          src={imageSrc}
          alt=""
          onError={(e) => {
            (e.target as HTMLImageElement).src = BLANK_IMAGE;
          }}
        />
      </Box>

      <Box className="pet-title">
        {form.petName || t("admin.discoveryPets.previewNamePh")}
      </Box>

      <Stack className="country-row" direction="row">
        <PublicRoundedIcon className="country-icon" />
        <Box className="country-text">
          {form.petCountry || t("admin.discoveryPets.previewCountryPh")}
        </Box>
      </Stack>

      <Box className="info-title">{t("discovery.info")}</Box>

      <Stack className="stats-list">
        {STAT_FIELDS.map((stat) => (
          <Box key={stat.key} className="stat-item">
            <Box className="stat-label">{t(stat.labelKey)}</Box>
            <Box className="stat-track">
              <Box
                className="stat-fill"
                style={{ width: `${form[stat.key]}%` }}
              />
            </Box>
          </Box>
        ))}
      </Stack>

      <Box className="description-title">{t("discovery.description")}</Box>
      <Box className="description-text admin-dsc-preview-desc">
        {form.petDescription || t("admin.discoveryPets.previewDescPh")}
      </Box>

      <Box
        component="span"
        className={`read-more-btn${form.petLink.trim() ? "" : " disabled"}`}
      >
        {t("actions.readMore")}
      </Box>
    </Stack>
  );
};

const DiscoveryPetsManager = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<"ALL" | PetCategory>(
    "ALL",
  );
  const debouncedSearch = useDebouncedValue(search);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<DiscoveryPet | null>(null);
  const [form, setForm] = useState<FormShape>(emptyForm);
  const [image, setImage] = useState<ImageSlot | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DiscoveryPet | null>(null);
  const [removeTarget, setRemoveTarget] = useState<DiscoveryPet | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** APOLLO REQUESTS **/

  const searchFilter: DiscoveryPetsInquiry = {
    page,
    limit: PETS_PER_PAGE,
    sort: "createdAt",
    direction: Direction.DESC,
    search: {
      petStatus: [PetStatus.ACTIVE, PetStatus.DELETE],
      ...(debouncedSearch.trim() ? { text: debouncedSearch.trim() } : {}),
      ...(filterCategory === "ALL" ? {} : { petCategory: [filterCategory] }),
    },
  };

  const {
    data: petsData,
    previousData: petsPreviousData,
    error: petsError,
    refetch: petsRefetch,
  } = useQuery(GET_ALL_DISCOVERY_PETS, {
    fetchPolicy: "cache-and-network",
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
  });

  const [createDiscoveryPet] = useMutation(CREATE_DISCOVERY_PET);
  const [updateDiscoveryPetByAdmin] = useMutation(
    UPDATE_DISCOVERY_PET_BY_ADMIN,
  );
  const [removeDiscoveryPetByAdmin] = useMutation(
    REMOVE_DISCOVERY_PET_BY_ADMIN,
  );
  const [imagesUploader] = useMutation(IMAGES_UPLOADER);

  /** DERIVED **/

  const petsResult = petsData ?? petsPreviousData;
  const pets: DiscoveryPet[] = isNoDataError(petsError)
    ? []
    : (petsResult?.getAllDiscoveryPets?.list ?? []);
  const total = isNoDataError(petsError)
    ? 0
    : metaTotal(petsResult?.getAllDiscoveryPets?.metaCounter);
  const totalPages = Math.max(1, Math.ceil(total / PETS_PER_PAGE));

  const previewImageSrc = image ? image.preview : BLANK_IMAGE;
  const isSaveEnabled =
    form.petName.trim().length >= 2 &&
    form.petCountry.trim().length >= 2 &&
    Boolean(form.petDescription.trim()) &&
    Boolean(image) &&
    (editingPet ? true : Boolean(form.petLink.trim())) &&
    !isSaving;

  /** HANDLERS **/

  const handleChange = <K extends keyof FormShape>(
    field: K,
    value: FormShape[K],
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const releasePreview = () => {
    if (image?.file) URL.revokeObjectURL(image.preview);
  };

  const pickFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    releasePreview();
    setImage({ file, preview: URL.createObjectURL(file) });
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    pickFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const removeImage = () => {
    releasePreview();
    setImage(null);
  };

  const openAdd = () => {
    releasePreview();
    setEditingPet(null);
    setForm(emptyForm);
    setImage(null);
    setDrawerOpen(true);
  };

  const openEdit = (pet: DiscoveryPet) => {
    releasePreview();
    setEditingPet(pet);
    setForm({
      petCategory: pet.petCategory,
      petName: pet.petName,
      petCountry: pet.petCountry,
      petDifficulty: pet.petDifficulty,
      petFerocious: pet.petFerocious,
      petSpace: pet.petSpace,
      petGroups: pet.petGroups,
      petDescription: pet.petDescription,
      petLink: pet.petLink ?? "",
    });
    setImage({ path: pet.petImage, preview: petImageSrc(pet.petImage) });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    releasePreview();
    setImage(null);
    setDrawerOpen(false);
  };

  const save = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);

      let petImage = image?.path;
      if (image?.file) {
        const { data } = await imagesUploader({
          variables: { files: [image.file], target: "discovery-pet" },
        });
        petImage = (data?.imagesUploader ?? [])[0];
        if (!petImage) throw new Error(t("admin.discoveryPets.uploadFailed"));
      }

      const sharedPayload = {
        petCategory: form.petCategory,
        petName: form.petName.trim(),
        petCountry: form.petCountry.trim(),
        petDifficulty: form.petDifficulty,
        petFerocious: form.petFerocious,
        petSpace: form.petSpace,
        petGroups: form.petGroups,
        petDescription: form.petDescription.trim(),
        petLink: form.petLink.trim(),
        petImage,
      };

      if (editingPet) {
        await updateDiscoveryPetByAdmin({
          variables: { input: { petId: editingPet._id, ...sharedPayload } },
        });
      } else {
        await createDiscoveryPet({ variables: { input: sharedPayload } });
      }

      await petsRefetch({ input: searchFilter });
      closeDrawer();
      await sweetBottomSmallSuccessAlert(
        editingPet
          ? t("admin.discoveryPets.saved")
          : t("admin.discoveryPets.added"),
        700,
      );
    } catch (err: any) {
      console.log("ERROR, save discoveryPet:", err.message);
      await sweetMixinErrorAlert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const restore = async (pet: DiscoveryPet) => {
    try {
      await updateDiscoveryPetByAdmin({
        variables: { input: { petId: pet._id, petStatus: PetStatus.ACTIVE } },
      });
      await petsRefetch({ input: searchFilter });
      await sweetBottomSmallSuccessAlert(
        t("admin.discoveryPets.restored"),
        700,
      );
    } catch (err: any) {
      console.log("ERROR, restore discoveryPet:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await updateDiscoveryPetByAdmin({
        variables: {
          input: { petId: deleteTarget._id, petStatus: PetStatus.DELETE },
        },
      });
      setDeleteTarget(null);
      await petsRefetch({ input: searchFilter });
      await sweetBottomSmallSuccessAlert(t("admin.discoveryPets.removed"), 700);
    } catch (err: any) {
      console.log("ERROR, confirmDelete discoveryPet:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const confirmRemove = async () => {
    if (!removeTarget) return;
    try {
      await removeDiscoveryPetByAdmin({
        variables: { input: removeTarget._id },
      });
      setRemoveTarget(null);
      await petsRefetch({ input: searchFilter });
      await sweetBottomSmallSuccessAlert(t("admin.discoveryPets.deleted"), 900);
    } catch (err: any) {
      console.log("ERROR, confirmRemove discoveryPet:", err.message);
      await sweetMixinErrorAlert(err.message);
    }
  };

  const resetToFirstPage = () => setPage(1);

  return (
    <Stack gap={0}>
      <Stack className="admin-page-header">
        <Typography className="admin-page-title">
          {t("admin.discoveryPets.title")}
        </Typography>
        <Button
          variant="contained"
          onClick={openAdd}
          className="admin-dsc-add-btn"
        >
          {t("admin.discoveryPets.addTitle")}
        </Button>
      </Stack>

      <Stack className="admin-card">
        <Stack className="admin-toolbar">
          <TextField
            size="small"
            placeholder={t("admin.discoveryPets.search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetToFirstPage();
            }}
            className="admin-toolbar-search admin-dsc-search"
          />
          <Select
            size="small"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value as "ALL" | PetCategory);
              resetToFirstPage();
            }}
            className="admin-toolbar-select admin-dsc-cat-filter"
          >
            <MenuItem value="ALL">{t("admin.filter.allCategories")}</MenuItem>
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {t(`enums.petCategory.${c}`)}
              </MenuItem>
            ))}
          </Select>
          <Typography className="admin-meta-count">
            {t("admin.showingOf", { shown: pets.length, total })}
          </Typography>
        </Stack>

        <TableContainer>
          <Table className="admin-table">
            <TableHead>
              <TableRow>
                <TableCell>{t("admin.col.pet")}</TableCell>
                <TableCell>{t("admin.col.category")}</TableCell>
                <TableCell>{t("admin.col.country")}</TableCell>
                <TableCell>{t("admin.col.stats")}</TableCell>
                <TableCell>{t("admin.col.likes")}</TableCell>
                <TableCell>{t("admin.col.views")}</TableCell>
                <TableCell>{t("admin.col.status")}</TableCell>
                <TableCell>{t("admin.col.actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pets.map((pet) => {
                const isRetired = pet.petStatus === PetStatus.DELETE;
                return (
                  <TableRow key={pet._id}>
                    <TableCell className="admin-dsc-name-cell">
                      <Stack className="admin-name-cell">
                        <Stack className="admin-dsc-thumb-box">
                          <img
                            src={petImageSrc(pet.petImage)}
                            alt=""
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src = BLANK_IMAGE;
                              img.style.opacity = "0";
                            }}
                          />
                        </Stack>
                        <Typography className="admin-dsc-name-text">
                          {pet.petName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell className="admin-dsc-cat-cell">
                      {t(`enums.petCategory.${pet.petCategory}`)}
                    </TableCell>
                    <TableCell className="admin-dsc-country-cell">
                      {pet.petCountry}
                    </TableCell>
                    <TableCell>
                      <MiniStatBars pet={pet} />
                    </TableCell>
                    <TableCell className="admin-dsc-stat-num">
                      {pet.petLikes}
                    </TableCell>
                    <TableCell className="admin-dsc-stat-num">
                      {pet.petViews}
                    </TableCell>
                    <TableCell>
                      <span className={statusChipClass(pet.petStatus)}>
                        {t(`enums.status.${pet.petStatus}`)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Stack className="admin-action-row">
                        {isRetired ? (
                          <>
                            <Button
                              size="small"
                              onClick={() => restore(pet)}
                              className="admin-dsc-btn-restore"
                            >
                              {t("admin.act.restore")}
                            </Button>
                            <Button
                              size="small"
                              onClick={() => setRemoveTarget(pet)}
                              className="admin-btn-delete"
                            >
                              {t("admin.act.remove")}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="small"
                              onClick={() => openEdit(pet)}
                              className="admin-btn-edit"
                            >
                              {t("admin.act.edit")}
                            </Button>
                            <Button
                              size="small"
                              onClick={() => setDeleteTarget(pet)}
                              className="admin-btn-delete"
                            >
                              {t("admin.act.delete")}
                            </Button>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {pets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography className="admin-table-empty">
                      {t("admin.empty.discoveryPets")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Stack className="admin-pagination">
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="primary"
            />
          </Stack>
        )}
      </Stack>

      {/* ── Drawer ───────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        PaperProps={{ className: "admin-dsc-drawer-paper" }}
        disablePortal
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          className="admin-dsc-drawer-header"
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            className="admin-dsc-header-icon-box"
          >
            <ExploreIcon className="admin-icon-20-indigo" />
          </Stack>
          <Stack flex={1} minWidth={0}>
            <Typography className="admin-dsc-drawer-title">
              {editingPet
                ? t("admin.discoveryPets.editTitle")
                : t("admin.discoveryPets.addTitle")}
            </Typography>
            <Typography className="admin-dsc-drawer-subtitle">
              {editingPet ? editingPet.petName : t("admin.discoveryPets.title")}
            </Typography>
          </Stack>
          <IconButton
            onClick={closeDrawer}
            size="small"
            className="admin-dsc-close-btn"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack direction="row" className="admin-dsc-drawer-body">
          <Stack className="admin-dsc-drawer-form">
            <Section title={t("admin.discoveryPets.basicInfo")}>
              <Stack>
                <Typography className="admin-dsc-field-label">
                  {t("admin.col.pet")}
                </Typography>
                <TextField
                  value={form.petName}
                  onChange={(e) => handleChange("petName", e.target.value)}
                  size="small"
                  fullWidth
                  placeholder={t("admin.discoveryPets.phName")}
                  className="admin-dsc-input-h42"
                />
              </Stack>
              <Stack direction="row" gap={1.5}>
                <Stack flex={1}>
                  <Typography className="admin-dsc-field-label">
                    {t("admin.col.category")}
                  </Typography>
                  <Select
                    size="small"
                    value={form.petCategory}
                    onChange={(e) =>
                      handleChange("petCategory", e.target.value as PetCategory)
                    }
                    className="admin-dsc-select"
                  >
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c} value={c}>
                        {t(`enums.petCategory.${c}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
                <Stack flex={1}>
                  <Typography className="admin-dsc-field-label">
                    {t("admin.col.country")}
                  </Typography>
                  <TextField
                    value={form.petCountry}
                    onChange={(e) => handleChange("petCountry", e.target.value)}
                    size="small"
                    fullWidth
                    placeholder={t("admin.discoveryPets.phCountry")}
                    className="admin-dsc-input-h42"
                  />
                </Stack>
              </Stack>
            </Section>

            <Section title={t("admin.discoveryPets.statsSection")}>
              {STAT_FIELDS.map((stat) => (
                <Stack key={stat.key}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography className="admin-dsc-slider-label">
                      {t(stat.labelKey)}
                    </Typography>
                    <span className="admin-dsc-slider-value">
                      {form[stat.key]}
                    </span>
                  </Stack>
                  <Slider
                    value={form[stat.key]}
                    onChange={(_, value) =>
                      handleChange(stat.key, value as number)
                    }
                    min={0}
                    max={100}
                    className="admin-dsc-slider"
                  />
                </Stack>
              ))}
            </Section>

            <Section title={t("admin.discoveryPets.detailsSection")}>
              <TextField
                label={t("admin.col.description")}
                value={form.petDescription}
                onChange={(e) => handleChange("petDescription", e.target.value)}
                size="small"
                multiline
                rows={4}
                fullWidth
                className="admin-dsc-input-auto"
              />
              <TextField
                label={t("admin.col.link")}
                value={form.petLink}
                onChange={(e) => handleChange("petLink", e.target.value)}
                size="small"
                fullWidth
                placeholder={t("admin.discoveryPets.phLink")}
                helperText={t("admin.discoveryPets.linkHelper")}
                className="admin-dsc-input"
              />
            </Section>

            <Section title={t("admin.discoveryPets.imageSection")}>
              {image && (
                <Stack className="admin-dsc-img-wrap">
                  <img
                    src={image.preview}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = BLANK_IMAGE;
                    }}
                  />
                  <Stack
                    className="rm admin-dsc-img-remove-btn"
                    onClick={removeImage}
                  >
                    <CloseIcon className="admin-icon-12-white" />
                  </Stack>
                </Stack>
              )}

              {!image && (
                <Stack
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    pickFile(e.dataTransfer.files?.[0]);
                  }}
                  className={`admin-dsc-upload-zone${isDragging ? " dragging" : ""}`}
                >
                  <Stack
                    className={`admin-dsc-upload-icon-box${isDragging ? " dragging" : ""}`}
                  >
                    <CloudUploadIcon
                      sx={{
                        fontSize: 22,
                        color: isDragging ? "#fff" : "#9CA3AF",
                      }}
                    />
                  </Stack>
                  <Typography className="admin-dsc-upload-label">
                    {t("admin.upload.uploadCta")}
                  </Typography>
                  <Typography className="admin-dsc-upload-hint">
                    {t("admin.upload.uploadFormats")}
                  </Typography>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileInput}
                  />
                </Stack>
              )}

              {!image && (
                <Typography className="admin-dsc-img-required-msg">
                  {t("admin.discoveryPets.imageRequired")}
                </Typography>
              )}
            </Section>
          </Stack>

          <Stack className="admin-dsc-preview-pane">
            <Typography className="admin-dsc-preview-label">
              {t("admin.discoveryPets.previewLabel")}
            </Typography>
            <DiscoveryCardPreview
              form={form}
              imageSrc={previewImageSrc}
              likes={editingPet?.petLikes ?? 0}
            />
            <Typography className="admin-dsc-preview-hint">
              {t("admin.discoveryPets.previewHint")}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          justifyContent="flex-end"
          gap={1.5}
          className="admin-dsc-drawer-footer"
        >
          <Button onClick={closeDrawer} className="admin-dsc-cancel-btn">
            {t("admin.act.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={save}
            disabled={!isSaveEnabled}
            className="admin-dsc-save-btn"
          >
            {isSaving
              ? t("admin.action.saving")
              : editingPet
                ? t("admin.action.save")
                : t("admin.discoveryPets.addTitle")}
          </Button>
        </Stack>
      </Drawer>

      {/* Retire confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        disablePortal
      >
        <DialogTitle className="admin-dsc-dialog-title">
          {t("admin.discoveryPets.deleteTitle")}
        </DialogTitle>
        <DialogContent>
          <Typography className="admin-dsc-dialog-body">
            {t("admin.discoveryPets.deleteBody")}
          </Typography>
        </DialogContent>
        <DialogActions className="admin-dsc-dialog-actions">
          <Button
            onClick={() => setDeleteTarget(null)}
            className="admin-dsc-dialog-cancel-btn"
          >
            {t("admin.act.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            className="admin-dsc-dialog-delete-btn"
          >
            {t("admin.act.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permanent removal confirmation */}
      <Dialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        maxWidth="xs"
        disablePortal
      >
        <DialogTitle className="admin-dsc-dialog-title">
          {t("admin.discoveryPets.removeTitle")}
        </DialogTitle>
        <DialogContent>
          <Typography className="admin-dsc-dialog-body">
            <strong>{removeTarget?.petName}</strong>{" "}
            {t("admin.discoveryPets.removeBody")}
          </Typography>
        </DialogContent>
        <DialogActions className="admin-dsc-dialog-actions">
          <Button
            onClick={() => setRemoveTarget(null)}
            className="admin-dsc-dialog-cancel-btn"
          >
            {t("admin.act.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={confirmRemove}
            className="admin-dsc-dialog-delete-btn"
          >
            {t("admin.act.remove")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default DiscoveryPetsManager;
